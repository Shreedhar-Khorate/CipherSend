"""
Charts API endpoint — provides analytics data for real-time dashboard.
Fetches file upload stats, storage usage, download activity, etc. from database.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from supabase import create_client

from app.core.config import get_settings

router = APIRouter(prefix="/charts")


def _db():
    """Get Supabase client."""
    s = get_settings()
    return create_client(s.supabase_url, s.supabase_key)


@router.get("/upload-stats")
async def get_upload_stats(days: Optional[int] = Query(30, le=365)):
    """
    Get file upload statistics over the last N days.
    Returns: Daily count of files uploaded.
    """
    try:
        db = _db()
        since = datetime.now(timezone.utc) - timedelta(days=days)
        
        resp = db.table("files").select("created_at").gte(
            "created_at", since.isoformat()
        ).order("created_at", desc=False).execute()
        
        # Group by date
        stats = {}
        for record in resp.data:
            date_str = record["created_at"][:10]  # YYYY-MM-DD
            stats[date_str] = stats.get(date_str, 0) + 1
        
        # Fill gaps with 0
        current = (datetime.now(timezone.utc) - timedelta(days=days)).date()
        while current <= datetime.now(timezone.utc).date():
            date_key = current.isoformat()
            if date_key not in stats:
                stats[date_key] = 0
            current += timedelta(days=1)
        
        labels = sorted(stats.keys())
        data = [stats[label] for label in labels]
        
        return {
            "labels": labels,
            "data": data,
            "total": sum(data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/storage-stats")
async def get_storage_stats(days: Optional[int] = Query(30, le=365)):
    """
    Get cumulative storage usage over the last N days.
    Returns: Daily cumulative storage used.
    """
    try:
        db = _db()
        since = datetime.now(timezone.utc) - timedelta(days=days)
        
        resp = db.table("files").select("created_at, file_size").gte(
            "created_at", since.isoformat()
        ).order("created_at", desc=False).execute()
        
        # Calculate cumulative storage by date
        storage_by_date = {}
        cumulative = 0
        
        current = (datetime.now(timezone.utc) - timedelta(days=days)).date()
        while current <= datetime.now(timezone.utc).date():
            date_key = current.isoformat()
            storage_by_date[date_key] = cumulative
            current += timedelta(days=1)
        
        for record in resp.data:
            date_str = record["created_at"][:10]
            if date_str not in storage_by_date:
                storage_by_date[date_str] = 0
        
        # Recalculate with actual file sizes
        sorted_dates = sorted(storage_by_date.keys())
        cumulative = 0
        for record in resp.data:
            date_str = record["created_at"][:10]
            cumulative += record["file_size"]
            for future_date in sorted_dates:
                if future_date >= date_str:
                    storage_by_date[future_date] = cumulative
        
        # Convert bytes to MB
        labels = sorted_dates
        data = [round(storage_by_date[label] / (1024 * 1024), 2) for label in labels]
        
        return {
            "labels": labels,
            "data": data,
            "totalMB": round(sum(data), 2) if data else 0,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download-stats")
async def get_download_stats(days: Optional[int] = Query(30, le=365)):
    """
    Get download activity over the last N days.
    Returns: Daily total downloads.
    """
    try:
        db = _db()
        since = datetime.now(timezone.utc) - timedelta(days=days)
        
        resp = db.table("files").select("created_at, downloads").gte(
            "created_at", since.isoformat()
        ).order("created_at", desc=False).execute()
        
        # Group downloads by date
        downloads_by_date = {}
        current = (datetime.now(timezone.utc) - timedelta(days=days)).date()
        while current <= datetime.now(timezone.utc).date():
            date_key = current.isoformat()
            downloads_by_date[date_key] = 0
            current += timedelta(days=1)
        
        for record in resp.data:
            date_str = record["created_at"][:10]
            downloads_by_date[date_str] = downloads_by_date.get(date_str, 0) + record["downloads"]
        
        labels = sorted(downloads_by_date.keys())
        data = [downloads_by_date[label] for label in labels]
        
        return {
            "labels": labels,
            "data": data,
            "total": sum(data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/top-files")
async def get_top_files(limit: Optional[int] = Query(5, ge=1, le=20)):
    """
    Get the most downloaded files.
    Returns: File names and download counts.
    """
    try:
        db = _db()
        
        resp = db.table("files").select(
            "id, file_name, downloads, file_size, created_at"
        ).order("downloads", desc=True).limit(limit).execute()
        
        files = []
        for record in resp.data:
            files.append({
                "id": record["id"],
                "name": record["file_name"][:30],  # Truncate long names
                "downloads": record["downloads"],
                "size_mb": round(record["file_size"] / (1024 * 1024), 2),
                "created_at": record["created_at"][:10],
            })
        
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
async def get_dashboard_summary():
    """
    Get quick dashboard summary stats.
    Returns: Total files, storage used, total downloads, avg file size.
    """
    try:
        db = _db()
        
        resp = db.table("files").select("id, file_size, downloads").execute()
        
        if not resp.data:
            return {
                "total_files": 0,
                "total_storage_mb": 0,
                "total_downloads": 0,
                "avg_file_size_mb": 0,
            }
        
        total_files = len(resp.data)
        total_storage = sum(r["file_size"] for r in resp.data)
        total_downloads = sum(r["downloads"] for r in resp.data)
        avg_file_size = total_storage / total_files if total_files > 0 else 0
        
        return {
            "total_files": total_files,
            "total_storage_mb": round(total_storage / (1024 * 1024), 2),
            "total_downloads": total_downloads,
            "avg_file_size_mb": round(avg_file_size / (1024 * 1024), 2),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
