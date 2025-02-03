# Plugin Authentication System

## 1. Authentication Flow

The main app uses Supabase for authentication. Here's the implementation for a secure way for the plugin to verify users:

```typescript
// In your main app, create a new API endpoint for plugin authentication
// app/api/plugin-auth/route.ts

import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    // Get auth token from request header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader) {
      return new NextResponse(
        JSON.stringify({ error: "No token provided" }),
        { status: 401 }
      )
    }

    // Verify the token
    const supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401 }
      )
    }

    // Generate a plugin-specific API key
    const pluginKey = generatePluginKey(user.id)
    
    return NextResponse.json({
      pluginKey,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    })
  } catch (error) {
    console.error("[PLUGIN_AUTH]", error)
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    )
  }
}
```

## 2. Plugin Integration

Implementation of the authentication flow in your plugin:

```typescript
// In your plugin

interface AuthResponse {
  pluginKey: string;
  userId: string;
  expiresAt: string;
}

class JobVaultPlugin {
  private pluginKey?: string;
  private userId?: string;
  private expiresAt?: Date;
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async authenticate(supabaseToken: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/plugin-auth`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const auth: AuthResponse = await response.json();
      this.pluginKey = auth.pluginKey;
      this.userId = auth.userId;
      this.expiresAt = new Date(auth.expiresAt);
      
      return true;
    } catch (error) {
      console.error('Plugin authentication failed:', error);
      return false;
    }
  }

  async sendJob(jobData: any): Promise<boolean> {
    if (!this.isAuthenticated()) {
      throw new Error('Plugin not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/jobs/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Plugin-Key': this.pluginKey!,
          'X-User-Id': this.userId!
        },
        body: JSON.stringify(jobData)
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to send job:', error);
      return false;
    }
  }

  private isAuthenticated(): boolean {
    return !!(
      this.pluginKey &&
      this.userId &&
      this.expiresAt &&
      this.expiresAt > new Date()
    );
  }
}
```

## 3. Security Considerations

### Token Validation
- Validate Supabase tokens server-side
- Use short-lived plugin-specific tokens
- Implement token refresh mechanism

### Rate Limiting
- Add rate limiting to prevent abuse
- Track usage per user

### Data Validation
- Validate job data format
- Sanitize inputs
- Check for duplicate jobs

## 4. Usage Example

```typescript
// In your plugin
const plugin = new JobVaultPlugin('https://your-job-vault-instance.com');

// When user logs in to your plugin
const supabaseToken = 'user-supabase-token';
await plugin.authenticate(supabaseToken);

// When scraping a job
const jobData = {
  position: 'Software Engineer',
  company: 'Tech Corp',
  location: 'Remote',
  description: 'Job description...',
  source_url: 'https://example.com/job',
  source_platform: 'LinkedIn'
};

await plugin.sendJob(jobData);
``` 