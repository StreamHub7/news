const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const PORT = process.env.PORT || 5000;

// middleware
const app = express();


app.use(express.json());
app.use(cors());



async function fetchData(channel_ID) {
 // Assuming the URL structure is /worker_url/channel_ID/index.m3u8
    console.log(channel_ID)
    
    // const sessionId = await fetch('https://dishtv-api.revlet.net/service/api/v1/get/token?tenant_code=dishtv&box_id=8ad4205c-93c2-14c6-b41a-8bd2ac726eaf&product=dishtv&device_id=61&device_sub_type=Chrome,119.0.0.0,Windows')
    //                         .then(res => res.json())
    //                         .then(data => {
    //                             return data.response.sessionId;
    //                         })
    //                         .catch(err => console.log(err));
  
    //                         console.log(sessionId)
  
    const apiUrl = `https://dishtv-api.revlet.net/service/api/v1/page/stream?path=channel/live/${channel_ID}`;
      
      try {
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            "Box-Id": process.env.BOX_ID,
            "Tenant-Code": "dishtv",
            "Session-Id": process.env.SESSION_ID
          }
        });
    
        if (response.status === 200) {
          const responseData = await response.json();
          console.log(responseData);
          const streamObj = responseData.response.streams[0];
    
          if (streamObj.params) {
            const streamUrl = streamObj.url+"?token="+streamObj.params.token+"&sessionid="+streamObj.params.sessionid;
            console.log(streamUrl)
            return streamUrl
          } else {
            return streamObj.url
          }
        } else {
          return null
        }
      } catch (error) {
        console.log(error);
        return null      
    }
} 

app.get('/stream', async (req, res) => { // assuming ':id' is the route parameter
    const id = req.query.id; // Access the route parameter using req.params.id
    try {
        console.log(id)
        const stream = await fetchData(id);
        res.redirect(stream);
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong'
        });
    }
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));