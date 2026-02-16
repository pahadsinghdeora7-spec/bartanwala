import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../../../lib/supabase";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newImage, setNewImage] = useState(null);


  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = async () => {

    const { data } = await supabase
      .from("products")
      .select(`
        *,
        categories(name),
        subcategories(name)
      `)
      .order("id", { ascending:false });

    setProducts(data || []);

  };


  useEffect(()=>{

    loadProducts();

    supabase.from("categories")
      .select("id,name")
      .then(({data})=>setCategories(data||[]));

    supabase.from("subcategories")
      .select("id,name,category_id")
      .then(({data})=>setSubcategories(data||[]));

  },[]);


  /* ================= DELETE ================= */

  const deleteProduct = async(id)=>{

    if(!confirm("Delete product?")) return;

    await supabase
      .from("products")
      .delete()
      .eq("id",id);

    loadProducts();

  };


  /* ================= EDIT ================= */

  const openEdit=(p)=>{

    setEditForm({...p});
    setNewImage(null);
    setEditOpen(true);

  };


  const updateProduct = async()=>{

    try{

      await supabase
        .from("products")
        .update({

          name:editForm.name,
          price:Number(editForm.price),

          size:editForm.size,
          gauge:editForm.gauge,
          weight:editForm.weight,

          description:editForm.description,

          category_id:editForm.category_id,
          subcategory_id:editForm.subcategory_id || null,

          in_stock:editForm.in_stock

        })
        .eq("id",editForm.id);


      if(newImage){

        const fileName =
          `${editForm.id}-${Date.now()}-${newImage.name}`;

        await supabase.storage
          .from("products")
          .upload(fileName,newImage);

        const { data } =
          supabase.storage
            .from("products")
            .getPublicUrl(fileName);

        await supabase
          .from("products")
          .update({
            image:data.publicUrl
          })
          .eq("id",editForm.id);

      }


      alert("Product updated");

      setEditOpen(false);

      loadProducts();

    }
    catch(err){

      alert(err.message);

    }

  };


  const filteredSubcats =
    subcategories.filter(
      s=>s.category_id===editForm?.category_id
    );


  /* ================= UI ================= */

  return(

  <>
  <Head>
  <title>Admin Products</title>
  </Head>


  <div style={styles.page}>

  <h2 style={styles.title}>
  Products
  </h2>


  {products.map(p=>(

  <div key={p.id} style={styles.card}>


    {/* IMAGE */}

    <img
      src={p.image || "/placeholder.png"}
      style={styles.image}
    />


    {/* CONTENT */}

    <div style={styles.content}>


      <div style={styles.name}>
      {p.name}
      </div>


      <div style={styles.price}>
      ₹ {p.price}
      </div>


      <div style={styles.meta}>
      {p.categories?.name || "-"}
      </div>


      <div style={styles.meta}>
      {p.subcategories?.name || "-"}
      </div>



      {/* BUTTON ROW */}

      <div style={styles.btnRow}>


        <button
          style={styles.editBtn}
          onClick={()=>openEdit(p)}
        >
        Edit
        </button>


        <button
          style={styles.deleteBtn}
          onClick={()=>deleteProduct(p.id)}
        >
        Delete
        </button>


      </div>


    </div>


  </div>

  ))}


  </div>



  {/* ================= EDIT MODAL ================= */}

  {editOpen && (

  <div style={styles.overlay}>

  <div style={styles.modal}>

  <h3>Edit Product</h3>


  <input
  style={styles.input}
  value={editForm.name}
  onChange={(e)=>
  setEditForm({
  ...editForm,
  name:e.target.value
  })}
  />


  <input
  style={styles.input}
  value={editForm.price}
  onChange={(e)=>
  setEditForm({
  ...editForm,
  price:e.target.value
  })}
  />


  <input
  type="file"
  onChange={(e)=>
  setNewImage(e.target.files[0])
  }
  />


  <div style={styles.modalActions}>


  <button
  style={styles.save}
  onClick={updateProduct}
  >
  Save
  </button>


  <button
  style={styles.cancel}
  onClick={()=>
  setEditOpen(false)
  }
  >
  Cancel
  </button>


  </div>


  </div>

  </div>

  )}


  </>

  );

}



/* ================= PROFESSIONAL STYLES ================= */

const styles={

page:{
padding:16,
background:"#f3f4f6",
minHeight:"100vh"
},

title:{
fontSize:20,
fontWeight:700,
marginBottom:14
},


/* CARD */

card:{
display:"flex",
gap:12,
background:"#fff",
padding:12,
borderRadius:12,
marginBottom:12,
boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
alignItems:"center"
},


image:{
width:70,
height:70,
objectFit:"contain",
borderRadius:8,
border:"1px solid #eee",
background:"#fff"
},


content:{
flex:1
},


name:{
fontSize:14,
fontWeight:600,
marginBottom:4
},


price:{
fontSize:15,
fontWeight:700,
color:"#0B5ED7"
},


meta:{
fontSize:12,
color:"#6b7280"
},


btnRow:{
display:"flex",
gap:8,
marginTop:8
},


editBtn:{
flex:1,
padding:"6px 0",
borderRadius:8,
border:"1px solid #0B5ED7",
background:"#fff",
color:"#0B5ED7",
fontWeight:600
},


deleteBtn:{
flex:1,
padding:"6px 0",
borderRadius:8,
border:"1px solid #ef4444",
background:"#fff",
color:"#ef4444",
fontWeight:600
},



/* MODAL */

overlay:{
position:"fixed",
inset:0,
background:"rgba(0,0,0,.4)",
display:"flex",
justifyContent:"center",
alignItems:"center"
},


modal:{
background:"#fff",
padding:16,
borderRadius:12,
width:"95%",
maxWidth:400
},


input:{
width:"100%",
padding:10,
marginTop:8,
borderRadius:8,
border:"1px solid #ddd"
},


modalActions:{
display:"flex",
gap:10,
marginTop:12
},


save:{
flex:1,
background:"#0B5ED7",
color:"#fff",
border:"none",
padding:10,
borderRadius:8
},


cancel:{
flex:1,
background:"#e5e7eb",
border:"none",
padding:10,
borderRadius:8
}

};
