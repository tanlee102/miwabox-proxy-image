import { NextResponse } from 'next/server'
import { getStore } from "@netlify/blobs";

export async function GET(request, context) {

  try {

      const password = String(request.nextUrl.searchParams.get("password"));

      const fileName = String(context.params.id);
      
      const fileParts = fileName.split(".");
      const extension = fileParts.pop();
      const id = fileParts.join(".");

      const store = getStore({
        name: 'images-store',
        siteID: '30cc35f8-b6da-4d54-ade8-0d6e322e0b48',
        token: 'nfp_nEoRVLqwwBCnV1aVTn9MCQV9juJKyiJD5f31',
      });
      const keys = getStore({
        name: 'keys-store',
        siteID: '30cc35f8-b6da-4d54-ade8-0d6e322e0b48',
        token: 'nfp_nEoRVLqwwBCnV1aVTn9MCQV9juJKyiJD5f31',
      });


      var approve = false
      if(password === String(process.env.PASSWORD)){
        approve = true
        await keys.set(id, 'true')
      }else{
        let tmp = await keys.get(id)
        if(tmp){
          approve = true
        }
      }


      if(approve){
        
        const headers = {
          "Content-Type": "image/"+extension,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Methods": "GET, POST, OPTION",
        }

        var blob = null;
        blob = await store.get(id, { type: 'blob' }); 
  
        if(blob){
          return new NextResponse(blob.stream(), { status: 200, headers });
        }else{
          // const url = 'https://drive.google.com/uc?id=' + id + '&export=download';
          const url = 'https://www.googleapis.com/drive/v3/files/'+id+'?key=AIzaSyCDEQ915m_RAEWxhOghge1sWUBO6cnROVI&alt=media';
    
          const response = await fetch(url, { cache: 'force-cache' });
          if(response.status == 200){
            blob = await response.blob();
            await store.set(id, blob, {type: 'blob'})
            return new NextResponse(blob.stream(), { status: 200, headers })
          }else{
            return NextResponse.json({ error: 'Not Found' }, { status: 404 });
          }
        }
      }else{
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

    } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


// const url = 'https://www.googleapis.com/drive/v3/files/'+id+'?key=AIzaSyCDEQ915m_RAEWxhOghge1sWUBO6cnROVI&alt=media'