import { supabase } from '../lib/supabase';
import { useEffect, useState } from 'react';

export default function Admin() {
  const [drawings, setDrawings] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchDrawings();
  }, []);

  const fetchDrawings = async () => {
    const { data } = await supabase.from('drawings').select('*');
    setDrawings(data);
  };

  const uploadDrawing = async () => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    // Upload para o Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('drawings')
      .upload(fileName, file);

    if (uploadError) return alert(uploadError.message);

    // Salva no banco
    const { error } = await supabase.from('drawings').insert({
      title: file.name,
      image_url: fileName,
      category_id: 1 // Altere conforme a categoria
    });

    if (error) alert(error.message);
    else fetchDrawings();
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadDrawing}>Upload</button>
      
      <div>
        {drawings.map((drawing) => (
          <img 
            key={drawing.id} 
            src={supabase.storage.from('drawings').getPublicUrl(drawing.image_url)} 
            alt={drawing.title}
          />
        ))}
      </div>
    </div>
  );
}