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
    if (!file) return alert('Selecione um arquivo!');
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
  
    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('drawings') // ← Nome do bucket deve bater aqui
      .upload(fileName, file);
  
    if (uploadError) {
      console.error(uploadError);
      return alert('Falha no upload: ' + uploadError.message);
    }
  
    // 2. Gerar URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('drawings')
      .getPublicUrl(fileName);
  
    // 3. Salvar metadados no banco
    const { error: dbError } = await supabase
      .from('drawings')
      .insert({
        title: file.name,
        image_url: publicUrl, // Agora usando a URL pública
        category_id: 1
      });
  
    if (dbError) alert('Erro no banco: ' + dbError.message);
    else {
      alert('Upload feito!');
      fetchDrawings();
    }
  };

  useEffect(() => {
    const checkBucket = async () => {
      const { data, error } = await supabase.storage.listBuckets();
      console.log('Buckets disponíveis:', data);
    };
    checkBucket();
  }, []);

}