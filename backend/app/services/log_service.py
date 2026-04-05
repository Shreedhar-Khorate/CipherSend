#!/usr/bin/env python3
"""Service for logging file access activities"""

import uuid
from datetime import datetime, timezone
from typing import Optional
from supabase import create_client

from app.core.config import get_settings


def _db():
    """Get Supabase client"""
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_key)


def log_activity(
    file_id: Optional[str],
    event_type: str,  # 'upload', 'download', 'failed_attempt'
    status: str = 'success',  # 'success' or 'failed'
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    attempt_count: int = 1
) -> None:
    """
    Log a file access activity to the access_logs table.
    
    Args:
        file_id: UUID of the file (optional for general activities)
        event_type: 'upload', 'download', or 'failed_attempt'
        status: 'success' or 'failed'
        ip_address: Client IP address
        user_agent: Browser/client user agent
        attempt_count: Number of attempts (default 1)
    """
    try:
        record = {
            'id': str(uuid.uuid4()),  # Generate unique log ID
            'file_id': file_id,
            'event_type': event_type,
            'status': status,
            'ip_address': ip_address,
            'user_agent': user_agent,
            'attempt_count': attempt_count,
            'created_at': datetime.now(timezone.utc).isoformat(),
        }
        
        response = _db().table('access_logs').insert(record).execute()
        return response.data
        
    except Exception as e:
        # Don't raise exception for logging failures - just print warning
        print(f"[!] Failed to log activity: {str(e)}")
        return None


def get_file_access_logs(file_id: str, limit: int = 100):
    """Get all access logs for a specific file"""
    try:
        response = _db().table('access_logs').select('*').eq('file_id', file_id).order('created_at', desc=True).limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"[!] Failed to retrieve logs: {str(e)}")
        return []


def get_recent_logs(limit: int = 50):
    """Get recent activity logs"""
    try:
        response = _db().table('access_logs').select('*').order('created_at', desc=True).limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"[!] Failed to retrieve logs: {str(e)}")
        return []


def get_logs_by_event_type(event_type: str, limit: int = 50):
    """Get logs filtered by event type"""
    try:
        response = _db().table('access_logs').select('*').eq('event_type', event_type).order('created_at', desc=True).limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"[!] Failed to retrieve logs: {str(e)}")
        return []


def get_failed_logs(limit: int = 50):
    """Get only failed attempt logs"""
    try:
        response = _db().table('access_logs').select('*').eq('status', 'failed').order('created_at', desc=True).limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"[!] Failed to retrieve logs: {str(e)}")
        return []


def get_logs_by_ip(ip_address: str, limit: int = 50):
    """Get logs from a specific IP address"""
    try:
        response = _db().table('access_logs').select('*').eq('ip_address', ip_address).order('created_at', desc=True).limit(limit).execute()
        return response.data
    except Exception as e:
        print(f"[!] Failed to retrieve logs: {str(e)}")
        return []


def delete_old_logs(days: int = 30) -> int:
    """Delete logs older than specified days"""
    try:
        from datetime import timedelta
        cutoff_date = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()
        response = _db().table('access_logs').delete().lt('created_at', cutoff_date).execute()
        return len(response.data) if response.data else 0
    except Exception as e:
        print(f"[!] Failed to delete old logs: {str(e)}")
        return 0
