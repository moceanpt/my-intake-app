# 🛠️ Development Guide: Preventing Next.js Cache Issues

## 🔧 **Quick Fix Commands**

When you encounter `Cannot find module './7300.js'` or similar cache errors:

```bash
# Option 1: Use the fresh dev script (recommended)
npm run dev:fresh

# Option 2: Manual cleanup
npm run clean
npm run dev

# Option 3: Nuclear option (if above don't work)
rm -rf .next node_modules/.cache .swc node_modules
npm install
npm run dev
```

## 📋 **New Scripts Available**

- `npm run dev:fresh` - Starts development server with fresh cache
- `npm run clean` - Cleans all cache directories
- `npm run dev` - Standard development server

## 🎯 **Configuration Changes Made**

### `next.config.js` Updates:
- **Disabled webpack caching** in development
- **Named module IDs** for consistency
- **Disabled turbo mode** to prevent cache corruption
- **Reduced buffer length** for better memory management

### Benefits:
✅ **Prevents cache corruption**  
✅ **Faster recovery from errors**  
✅ **More stable development experience**  
✅ **Consistent module resolution**

## 🚨 **When You See These Errors:**

### Error: `Cannot find module './7300.js'`
**Solution**: Run `npm run dev:fresh`

### Error: `404 on static chunks`
**Solution**: Run `npm run clean && npm run dev`

### Error: `Module parse failed`
**Solution**: Stop server, run `rm -rf .next`, restart

## 💡 **Best Practices**

1. **Use `npm run dev:fresh`** instead of `npm run dev` when starting work
2. **Run clean command** before major changes
3. **Restart server** after installing new packages
4. **Use fresh script** after git pulls/merges

## 🔄 **Daily Workflow**

```bash
# Morning routine
npm run dev:fresh

# After git pull
npm run clean
npm run dev

# Before committing
npm run build  # Test production build
```

This should eliminate the recurring cache corruption issues! 🎉 