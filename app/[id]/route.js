import { NextResponse } from 'next/server'
import { getStore } from "@netlify/blobs";

//This is router image
export async function GET(request, context) {

  try {

      const password = String(request.nextUrl.searchParams.get("password"));

      const fileName = String(context.params.id);
      
      const fileParts = fileName.split(".");
      const extension = fileParts.pop();
      const id = fileParts.join(".");

      const store = getStore({
        name: 'images-store',
        siteID: process.env.siteID,
        token: process.env.token,
      });
      const keys = getStore({
        name: 'keys-store',
        siteID: process.env.siteID,
        token: process.env.token,
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
          "Access-Control-Allow-Methods": "GET",
        }

        var blob = null;
        blob = await store.get(id, { type: 'blob' }); 
  
        if(blob){
          return new NextResponse(blob.stream(), { status: 200, headers });
        }else{
          const url = 'https://drive.google.com/uc?id=' + id + '&export=download';
    
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