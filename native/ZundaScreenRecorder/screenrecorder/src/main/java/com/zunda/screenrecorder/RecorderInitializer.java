package com.zunda.screenrecorder;

import android.content.ContentProvider;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;

/**
 * 用 ContentProvider 在应用启动时拿到 ApplicationContext。
 * 这样 JS 调用静态桥时不需要传 Activity 对象，兼容性更好。
 */
public class RecorderInitializer extends ContentProvider {
    static Context appContext;

    @Override
    public boolean onCreate() {
        Context ctx = getContext();
        appContext = ctx == null ? null : ctx.getApplicationContext();
        return true;
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {
        return null;
    }

    @Override
    public String getType(Uri uri) {
        return null;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        return null;
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        return 0;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection, String[] selectionArgs) {
        return 0;
    }
}
