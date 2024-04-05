import { NextResponse } from 'next/server'
import { getStore, getDeployStore } from "@netlify/blobs";

export async function GET(request, context) {

  try {

      const id = String(context.params.id).replace('.jpeg', '');
      const headers = {
        "Content-Type": "image/jpeg",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTION",
    }
      
      const store = getStore({
        name: 'image-store',
        siteID: '30cc35f8-b6da-4d54-ade8-0d6e322e0b48',
        token: 'nfp_nEoRVLqwwBCnV1aVTn9MCQV9juJKyiJD5f31',
      });


      var blob = null
      blob = await store.get(id); 

      if(blob){
        return new NextResponse(blob, { status: 200, headers })
      }else{
        const url = 'https://drive.google.com/uc?id=' + id + '&export=download';
        // const url = 'https://www.googleapis.com/drive/v3/files/'+req.nextUrl.searchParams.get("id")+'?key=AIzaSyCDEQ915m_RAEWxhOghge1sWUBO6cnROVI&alt=media'
  
        const response = await fetch(url, { cache: 'force-cache' });
        blob = await response.blob();

        await store.set(id, blob, {type: 'blob'})

        return new NextResponse(blob, { status: 200, headers })
      }

    } catch (error) {
      console.log(error)
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
}