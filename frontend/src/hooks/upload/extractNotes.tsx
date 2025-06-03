
const extractNotes = async (file: File) => {
  if (file) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch('/api/user/upload', {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if(!res.ok || data.error) {
       console.error(data.error);
        throw new Error(data.error || "Unknown server error")
      }
      return data.data;
    }
    catch(error: any) {
      throw error;
    }
  }
}

export default extractNotes;