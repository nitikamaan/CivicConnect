// Configuration file for CivicConnect
const CONFIG = {
    // Supabase settings (you'll need to get these from Supabase.com)
    supabase: {
        url: 'https://viapjwhwndefdongsfxl.supabase.co', // Replace with your Supabase URL
        key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYXBqd2h3bmRlZmRvbmdzZnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDQ3NzEsImV4cCI6MjA3MzI4MDc3MX0.C2IIvm41Do0tYLZ2ZgP6GUbmCSCepF1GH8bhjgky-iw'  // Replace with your Supabase key
    },
    
    // File upload settings
    fileUpload: {
        maxSize: 5 * 1024 * 1024, // 5MB in bytes
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
        bucketName: 'issue-images'
    },
    
    // App settings
    app: {
        name: 'CivicConnect',
        version: '1.0.0'
    }
};