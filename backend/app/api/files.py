"""
File management and retrieval endpoints
"""

from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from supabase import create_client

from app.core.config import get_settings

router = APIRouter()


def _db():
    """Get Supabase client"""
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_key)


def _get_record(file_id: str) -> dict:
    """Fetch the file metadata row; raises 404 if not found."""
    resp = _db().table("files").select("*").eq("id", file_id).execute()
    if not resp.data:
        raise HTTPException(status_code=404, detail="File not found")
    return resp.data[0]


@router.get("/files", summary="List all files")
async def list_files(
    request: Request,
    limit: int = 50,
    offset: int = 0,
    sort_by: str = "created_at",
):
    """
    List all uploaded files with metadata.
    
    Query parameters:
    - limit: Number of files to return (default 50, max 100)
    - offset: Number of files to skip (for pagination)
    - sort_by: Sort field - 'created_at' (default), 'file_size', 'downloads'
    """
    if limit > 100:
        limit = 100
    
    valid_sorts = ['created_at', 'file_size', 'downloads']
    if sort_by not in valid_sorts:
        sort_by = 'created_at'
    
    try:
        response = _db().table('files').select('*').order(
            sort_by, desc=True
        ).range(offset, offset + limit - 1).execute()
        
        files = []
        if response.data:
            for file in response.data:
                files.append({
                    'id': file['id'],
                    'file_name': file['file_name'],
                    'file_size': file['file_size'],
                    'downloads': file['downloads'],
                    'download_limit': file['download_limit'],
                    'expiry_time': file['expiry_time'],
                    'password_protected': bool(file.get('password_hash')),
                    'created_at': file['created_at']
                })
        
        return {
            'status': 'success',
            'count': len(files),
            'limit': limit,
            'offset': offset,
            'files': files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/files/{file_id}/metadata", summary="Get detailed file metadata")
async def get_file_metadata(file_id: str):
    """
    Get complete metadata for a file including:
    - File name, size, hash
    - Download statistics
    - Expiry information
    - Password protection status
    """
    try:
        record = _get_record(file_id)
        
        return {
            'status': 'success',
            'file': {
                'id': record['id'],
                'file_name': record['file_name'],
                'file_size': record['file_size'],
                'storage_path': record['storage_path'],
                'hash_sha256': record['hash_sha256'],
                'password_protected': bool(record.get('password_hash')),
                'download_limit': record['download_limit'],
                'downloads': record['downloads'],
                'downloads_remaining': record['download_limit'] - record['downloads'],
                'expiry_time': record['expiry_time'],
                'created_at': record.get('created_at'),
                'encryption_key_stored': bool(record.get('encryption_key'))
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/files/{file_id}/activity", summary="Get file activity logs")
async def get_file_activity(file_id: str, limit: int = 50):
    """
    Get activity logs for a specific file including:
    - Upload, download, and failed attempt events
    - IP addresses and user agents
    - Timestamps
    """
    if limit > 100:
        limit = 100
    
    try:
        # First verify the file exists
        _get_record(file_id)
        
        # Get activity logs
        response = _db().table('access_logs').select('*').eq(
            'file_id', file_id
        ).order('created_at', desc=True).limit(limit).execute()
        
        activities = []
        if response.data:
            for log in response.data:
                activities.append({
                    'id': log['id'],
                    'event_type': log['event_type'],
                    'status': log['status'],
                    'ip_address': log['ip_address'],
                    'user_agent': log['user_agent'],
                    'created_at': log['created_at']
                })
        
        return {
            'status': 'success',
            'file_id': file_id,
            'activity_count': len(activities),
            'activities': activities
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/summary", summary="Get system statistics")
async def get_stats():
    """
    Get overall system statistics:
    - Total files uploaded
    - Total downloads
    - Storage usage
    - Activity summary
    """
    try:
        # Get files stats
        files_response = _db().table('files').select('*').execute()
        files = files_response.data if files_response.data else []
        
        total_files = len(files)
        total_size = sum(f['file_size'] for f in files) if files else 0
        total_downloads = sum(f['downloads'] for f in files) if files else 0
        
        # Get activity stats
        logs_response = _db().table('access_logs').select('*').execute()
        logs = logs_response.data if logs_response.data else []
        
        successful_uploads = len([l for l in logs if l['event_type'] == 'upload' and l['status'] == 'success'])
        successful_downloads = len([l for l in logs if l['event_type'] == 'download' and l['status'] == 'success'])
        failed_attempts = len([l for l in logs if l['status'] == 'failed'])
        
        # Count password-protected files
        protected_count = len([f for f in files if f.get('password_hash')])
        
        return {
            'status': 'success',
            'files': {
                'total': total_files,
                'password_protected': protected_count,
                'public': total_files - protected_count,
                'total_size_bytes': total_size,
                'total_size_mb': round(total_size / (1024*1024), 2)
            },
            'activity': {
                'total_uploads': successful_uploads,
                'total_downloads': total_downloads,
                'failed_attempts': failed_attempts,
                'total_events': len(logs)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats/recent-activity", summary="Get recent activity")
async def get_recent_activity(limit: int = 20):
    """
    Get the most recent file activities across the system
    """
    if limit > 100:
        limit = 100
    
    try:
        response = _db().table('access_logs').select('*').order(
            'created_at', desc=True
        ).limit(limit).execute()
        
        activities = []
        if response.data:
            for log in response.data:
                activities.append({
                    'id': log['id'],
                    'file_id': log['file_id'],
                    'event_type': log['event_type'],
                    'status': log['status'],
                    'ip_address': log['ip_address'],
                    'created_at': log['created_at']
                })
        
        return {
            'status': 'success',
            'count': len(activities),
            'activities': activities
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
