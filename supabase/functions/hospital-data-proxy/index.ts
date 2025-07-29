
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 處理 CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { baseUrl, endpoint, apiKey, startDate, timeout } = await req.json()
    
    // 建構完整的 API URL
    const fullUrl = `${baseUrl}${endpoint}${endpoint.includes('?') ? '&' : '?'}StartDate=${startDate}`;
    
    // 設定請求標頭
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    
    // 建立 AbortController 用於超時控制
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout * 1000)
    
    console.log('Fetching data from:', fullUrl)
    
    // 呼叫原始 API
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in hospital-data-proxy:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
