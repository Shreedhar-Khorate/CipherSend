# 🧪 Quick Test Guide - Expiry & Download Limits

## Start Services
```bash
# Terminal 1
cd backend
uvicorn app.main:app --reload

# Terminal 2
cd frontend
npm run dev

# Browser
http://localhost:5173
```

---

## Test Case 1: Download Limit Enforcement ✅

### Setup:
1. Click **Upload File**
2. Select any file
3. Set **Download limit: 1**
4. Keep expiry at 24 hours
5. Click **Upload**

### Test:
1. Copy share link → Open in new tab
2. See: "Downloads: 0/1" ✅
3. See: "Downloads remaining: 1" ✅
4. **Click Download** ✅
5. File downloads successfully
6. Go back to download page
7. See: "Downloads: 1/1" ⚠️
8. See warning: "This is the last download available"
9. **Try to click Download** → Button says "Download limit reached" ✅
10. Button is **disabled** ✅

### Expected Result:
```
Initial:   [Download button enabled] ← Downloads: 0/1
After 1st: [Download button DISABLED] ← Downloads: 1/1 "Download limit reached"
```

---

## Test Case 2: Expiry Time Enforcement ✅

### Setup (Simulated):
1. Upload file normally (24h default expiry)
2. Open in browser console:
   ```javascript
   // Simulate time jump to after expiry
   localStorage.setItem("testFakeCurrentTime", Date.now() + 25*60*60*1000);
   ```
3. Refresh page

### Expected Result:
```
Error page displays:
- Icon: ❌ Alert circle
- Title: "This file has expired and is no longer available"
- No download button shown
- Button to go home
```

---

## Test Case 3: Time Remaining Display ✅

### Setup:
1. Upload file (24h expiry)
2. Download page shows:

### Expected Display:
```
⏱️ 24h remaining          (if 24+ hours left)
⏱️ 12h 30m remaining     (if < 24 hours)
⏱️ 45m remaining         (if < 1 hour) - shown in RED
⏱️ Expired               (if past expiry)
```

---

## Test Case 4: Expiry Warning ✅

### Setup:
1. Upload file
2. Manually set expiry time in database to 1 hour from now
3. Refresh download page

### Expected Result:
```
⏱️ 59m remaining (shown in RED/primary color)
⚠️ File will expire in less than 2 hours (yellow warning box)
[Download button still enabled but user is warned]
```

---

## Test Case 5: Password Protected File ✅

### Setup:
1. Upload file with **password: "test123"**
2. Set download limit to 1
3. Share link

### Test:
1. Visit download page
2. See: "Enter password to decrypt"
3. Leave password empty
4. **Download button is DISABLED** ✅
5. Enter wrong password "wrong"
6. Click **Download** → Error: "Incorrect password"
7. Enter correct password "test123"
8. Click **Download** → File downloads ✅
9. Try to download again:
   - Pattern: "Downloads: 1/1"
   - Warning: "This is the last download"
   - Button: "Download limit reached" ❌

---

## Test Case 6: Multiple Downloads with Limit ✅

### Setup:
1. Upload file with **Download limit: 3**
2. Share the link multiple times

### Test Progress:

| Action | Display | Button | Status |
|--------|---------|--------|--------|
| Page load | Downloads: 0/3, 3 remaining | ✅ Enabled | OK |
| Download #1 | Downloads: 1/3, 2 remaining | ✅ Enabled | OK |
| Download #2 | Downloads: 2/3, 1 remaining | ✅ Enabled | ⚠️ Last one! |
| Download #3 | Downloads: 3/3, 0 remaining | ❌ DISABLED | Limit reached |

---

## Browser Console Testing

```javascript
// Test 1: Check if file is expired
const expiryTime = new Date(document.querySelector('[class*="expiry"]')?.textContent);
console.log("Expired?", new Date() > expiryTime);

// Test 2: Extract download count
const downloads = document.body.innerText.match(/Downloads: (\d+)\/(\d+)/);
console.log("Downloads:", downloads[1], "Limit:", downloads[2]);
```

---

## Verify in Database

```bash
cd backend
python verify_db.py

# You should see test data inserted:
# ✅ files table accessible - X total records
# ✅ access_logs table accessible - X total records
```

Check specific file:
```bash
python -c "
from app.core.config import get_settings
from supabase import create_client

s = get_settings()
db = create_client(s.supabase_url, s.supabase_key)

# Get all files
response = db.table('files').select('*').limit(1).execute()
if response.data:
    f = response.data[-1]
    print(f'File: {f[\"file_name\"]}')
    print(f'Downloads: {f[\"downloads\"]}/{f[\"download_limit\"]}')
    print(f'Expires: {f[\"expiry_time\"]}')
    print(f'Password protected: {bool(f.get(\"password_hash\"))}')
"
```

---

## Expected Success Criteria

All tests pass when:

- [ ] Download button disabled when limit reached
- [ ] Time remaining shows accurate countdown
- [ ] Expiry warning shows when < 2 hours left
- [ ] Last download warning shows
- [ ] Cannot download after limit reached
- [ ] Cannot download after expiry
- [ ] Password block works
- [ ] Download counter increments
- [ ] Database records update

---

## Troubleshooting

### Issue: Button not disabled when should be
**Solution:**
1. Check browser console for errors
2. Verify file data loaded: Open DevTools → Network → Find `/files/{id}` request
3. Check response status (should be 200)
4. Check file data for `downloads` and `download_limit` fields

### Issue: Expiry time shows but file still downloadable
**Solution:**
1. Verify current date/time is correct on computer
2. Check database: `python verify_db.py` and look at expiry_time
3. Paste expiry time and current time in console:
   ```javascript
   new Date("2026-04-06T11:40:00+00:00") > new Date()
   ```

### Issue: Download counter not incrementing
**Solution:**
1. Check backend terminal for errors
2. Verify database connection working: `python verify_db.py`
3. Check access logs being created: should see `event_type: 'download'`

---

## Quick Debug Commands

```bash
# Check if backend is running
curl http://localhost:8000/api/v1/health

# Check database
cd backend && python verify_db.py

# Check file in database
python -c "
from app.services.file_service import _get_record
record = _get_record('YOUR_FILE_ID')
print(record)
"
```

---

## Success! 🎉

When all tests pass:
- ✅ Files become inaccessible after expiry
- ✅ Files become inaccessible after download limit
- ✅ Users see clear warnings and error messages
- ✅ Download button properly disabled/enabled
- ✅ Time remaining updates dynamically
- ✅ Download counter increments
