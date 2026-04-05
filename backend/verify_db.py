#!/usr/bin/env python3
"""
CipherSend Database Verification Script
This script tests all database operations and connectivity
Run this to verify:
1. Environment variables are loaded correctly
2. Supabase connection works
3. Tables exist and are accessible
4. Can insert/retrieve data
"""

import sys
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

from app.core.config import get_settings
from supabase import create_client
import uuid


def print_header(text):
    """Print a formatted header"""
    print(f"\n{'='*70}")
    print(f"  {text}")
    print(f"{'='*70}\n")


def print_status(status, message):
    """Print status with emoji"""
    emoji = "✅" if status else "❌"
    print(f"{emoji} {message}")


def test_environment_variables():
    """Test that environment variables are loaded"""
    print_header("1. Testing Environment Variables")
    
    try:
        settings = get_settings()
        
        print_status(bool(settings.supabase_url), f"SUPABASE_URL: {settings.supabase_url[:50]}...")
        print_status(bool(settings.supabase_key), f"SUPABASE_KEY: {settings.supabase_key[:20]}...")
        print_status(bool(settings.aes_secret_key), f"AES_SECRET_KEY: {settings.aes_secret_key[:20]}...")
        
        print(f"\n📋 Configuration Summary:")
        print(f"   - Environment: {settings.environment}")
        print(f"   - Max file size: {settings.max_file_size_mb} MB")
        print(f"   - Default expiry: {settings.default_expiry_hours} hours")
        print(f"   - Max downloads: {settings.max_download_limit}")
        
        return True
    except Exception as e:
        print_status(False, f"Failed to load settings: {str(e)}")
        return False


def test_database_connection():
    """Test Supabase database connection"""
    print_header("2. Testing Database Connection")
    
    try:
        settings = get_settings()
        db = create_client(settings.supabase_url, settings.supabase_key)
        
        # Test files table
        print("📌 Testing 'files' table...")
        files_response = db.table("files").select("*", count="exact").limit(1).execute()
        files_count = files_response.count if hasattr(files_response, 'count') else 0
        print_status(True, f"'files' table accessible - {files_count} total records in table")
        
        # Test access_logs table
        print("\n📌 Testing 'access_logs' table...")
        logs_response = db.table("access_logs").select("*", count="exact").limit(1).execute()
        logs_count = logs_response.count if hasattr(logs_response, 'count') else 0
        print_status(True, f"'access_logs' table accessible - {logs_count} total records in table")
        
        return True, db
    except Exception as e:
        print_status(False, f"Database connection failed: {str(e)}")
        return False, None


def test_insert_test_data(db):
    """Test inserting test data into database"""
    print_header("3. Testing Data Insertion")
    
    try:
        # Create test file record
        test_file_id = str(uuid.uuid4())
        test_record = {
            "id": test_file_id,
            "file_name": "test-file-verification.txt",
            "storage_path": f"test_encrypted_{test_file_id}.bin",
            "file_size": 1024,
            "hash_sha256": "abc123def456abc123def456abc123def456abc123def456abc123def456abc1",
            "password_hash": None,
            "encryption_key": "test_key_" + test_file_id[:8],
            "download_limit": 5,
            "downloads": 0,
            "expiry_time": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        
        print(f"📝 Inserting test file record...")
        print(f"   - File ID: {test_file_id}")
        print(f"   - File name: {test_record['file_name']}")
        
        files_response = db.table("files").insert(test_record).execute()
        
        if files_response.data:
            print_status(True, f"Successfully inserted test file")
            
            # Test inserting log record
            test_log_id = str(uuid.uuid4())
            test_log = {
                "id": test_log_id,
                "file_id": test_file_id,
                "event_type": "upload",
                "status": "success",
                "ip_address": "127.0.0.1",
                "user_agent": "verification-script",
                "attempt_count": 1,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            
            print(f"\n📝 Inserting test log record...")
            logs_response = db.table("access_logs").insert(test_log).execute()
            
            if logs_response.data:
                print_status(True, f"Successfully inserted test log")
                return True, test_file_id, test_log_id
            else:
                print_status(False, "Failed to insert log record")
                return False, test_file_id, None
        else:
            print_status(False, "Failed to insert file record")
            return False, None, None
            
    except Exception as e:
        print_status(False, f"Insertion failed: {str(e)}")
        return False, None, None


def test_retrieve_data(db, file_id, log_id):
    """Test retrieving data from database"""
    print_header("4. Testing Data Retrieval")
    
    try:
        # Retrieve file record
        print(f"🔍 Retrieving file record (ID: {file_id[:8]}...)...")
        files_response = db.table("files").select("*").eq("id", file_id).execute()
        
        if files_response.data and len(files_response.data) > 0:
            file_record = files_response.data[0]
            print_status(True, f"Retrieved file: {file_record['file_name']}")
            print(f"   - Size: {file_record['file_size']} bytes")
            print(f"   - Downloads: {file_record['downloads']}/{file_record['download_limit']}")
            print(f"   - Expires: {file_record['expiry_time']}")
        else:
            print_status(False, "Could not retrieve file record")
            return False
        
        # Retrieve log record
        print(f"\n🔍 Retrieving log record (ID: {log_id[:8] if log_id else 'N/A'}...)...")
        if log_id:
            logs_response = db.table("access_logs").select("*").eq("id", log_id).execute()
            
            if logs_response.data and len(logs_response.data) > 0:
                log_record = logs_response.data[0]
                print_status(True, f"Retrieved log: {log_record['event_type']} ({log_record['status']})")
                print(f"   - IP: {log_record['ip_address']}")
                print(f"   - Agent: {log_record['user_agent']}")
            else:
                print_status(False, "Could not retrieve log record")
                return False
        
        return True
        
    except Exception as e:
        print_status(False, f"Retrieval failed: {str(e)}")
        return False


def cleanup_test_data(db, file_id, log_id):
    """Clean up test data from database"""
    print_header("5. Cleaning Up Test Data")
    
    try:
        # Delete log record first (has foreign key reference)
        if log_id:
            print(f"🗑️  Deleting test log record...")
            db.table("access_logs").delete().eq("id", log_id).execute()
            print_status(True, "Test log deleted")
        
        # Delete file record
        if file_id:
            print(f"🗑️  Deleting test file record...")
            db.table("files").delete().eq("id", file_id).execute()
            print_status(True, "Test file deleted")
        
        return True
    except Exception as e:
        print_status(False, f"Cleanup failed: {str(e)}")
        return False


def main():
    """Run all tests"""
    print("\n")
    print("╔" + "═"*68 + "╗")
    print("║" + " "*15 + "CipherSend Database Verification" + " "*21 + "║")
    print("╚" + "═"*68 + "╝")
    
    # Test 1: Environment variables
    if not test_environment_variables():
        print("\n❌ Environment variables not configured properly!")
        return False
    
    # Test 2: Database connection
    connected, db = test_database_connection()
    if not connected or not db:
        print("\n❌ Cannot connect to database!")
        return False
    
    # Test 3: Insert test data
    inserted, file_id, log_id = test_insert_test_data(db)
    if not inserted:
        print("\n❌ Cannot insert data into database!")
        return False
    
    # Test 4: Retrieve data
    if not test_retrieve_data(db, file_id, log_id):
        print("\n❌ Cannot retrieve data from database!")
        return False
    
    # Test 5: Cleanup
    cleanup_test_data(db, file_id, log_id)
    
    # Summary
    print_header("✅ All Tests Passed!")
    print("""
Your CipherSend database is properly configured and working!

✅ Environment variables loaded
✅ Database connection established
✅ Tables accessible
✅ Data insertion works
✅ Data retrieval works

You're ready to use CipherSend!
    """)
    
    return True


if __name__ == "__main__":
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Verification interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
