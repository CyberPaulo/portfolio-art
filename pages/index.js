import { supabase } from '../lib/supabase';

export default function Home({ drawings }) {
  return (
    <div>
      <h1>Portfólio</h1>
      <div className="grid">
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

export async function getServerSideProps() {
  const { data } = await supabase.from('drawings').select('*');
  return { props: { drawings: data } };
}