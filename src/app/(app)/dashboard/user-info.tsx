export default async function UserInfo() {
    
    await new Promise(r => setTimeout(r, 2000)); // 模擬慢資料
    return <div>👤 User: Wilson</div>;
  }
  
