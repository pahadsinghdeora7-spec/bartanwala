import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../../../lib/supabase";

export default function AdminProducts(){

const [products,setProducts]=useState([]);
const [categories,setCategories]=useState([]);
const [subcategories,setSubcategories]=useState([]);

const [editOpen,setEditOpen]=useState(false);
const [editForm,setEditForm]=useState(null);

const [newImages,setNewImages]=useState([]);


/* ================= LOAD PRODUCTS ================= */

async function loadProducts(){

const { data } = await supabase
.from("products")
.select(`
*,
categories(name),
subcategories(name)
`)
.order("id",{ascending:false});

setProducts(data || []);

}


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

async function deleteProduct(id){

if(!confirm("Delete product?")) return;

await supabase
.from("products")
.delete()
.eq("id",id);

loadProducts();

}



/* ================= OPEN EDIT ================= */

function openEdit(p){

setEditForm({...p});

setNewImages([]);

setEditOpen(true);

}



/* ================= UPDATE PRODUCT ================= */

async function updateProduct(){

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



/* ===== UPLOAD MULTIPLE IMAGES ===== */

if(newImages.length>0){

let urls=[];

for(let i=0;i<newImages.length && i<4;i++){

const file=newImages[i];

const fileName=
`${editForm.id}-${Date.now()}-${i}-${file.name}`;

await supabase.storage
.from("products")
.upload(fileName,file);

const { data }=
supabase.storage
.from("products")
.getPublicUrl(fileName);

urls.push(data.publicUrl);

}

await supabase
.from("products")
.update({

image:urls[0] || editForm.image,
image1:urls[1] || editForm.image1,
image2:urls[2] || editForm.image2,
image3:urls[3] || editForm.image3

})
.eq("id",editForm.id);

}


alert("Product updated successfully");

setEditOpen(false);

loadProducts();

}
catch(err){

alert(err.message);

}

}



const filteredSubcats=
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
Admin Products
</h2>



{/* PRODUCT LIST */}

{products.map(p=>(

<div key={p.id} style={styles.card}>


<img
src={p.image || "/placeholder.png"}
style={styles.image}
/>


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

<h3 style={{marginBottom:10}}>
Edit Product
</h3>



{/* IMAGE PREVIEW */}

<div style={styles.imageGrid}>

{[
editForm.image,
editForm.image1,
editForm.image2,
editForm.image3
].map((img,i)=>(

<div key={i} style={styles.imageBox}>

{img
?
<img src={img} style={styles.previewImg}/>
:
<div style={styles.noImg}>No Image</div>
}

</div>

))}

</div>



{/* IMAGE UPLOAD */}

<input
type="file"
multiple
accept="image/*"
onChange={(e)=>
setNewImages([...e.target.files])
}
style={styles.input}
/>



{/* NAME */}

<input
style={styles.input}
value={editForm.name || ""}
onChange={(e)=>
setEditForm({...editForm,name:e.target.value})
}
placeholder="Product Name"
/>



{/* PRICE */}

<input
style={styles.input}
value={editForm.price || ""}
onChange={(e)=>
setEditForm({...editForm,price:e.target.value})
}
placeholder="Price"
/>



{/* SIZE */}

<input
style={styles.input}
value={editForm.size || ""}
onChange={(e)=>
setEditForm({...editForm,size:e.target.value})
}
placeholder="Size"
/>



{/* GAUGE */}

<input
style={styles.input}
value={editForm.gauge || ""}
onChange={(e)=>
setEditForm({...editForm,gauge:e.target.value})
}
placeholder="Gauge"
/>



{/* WEIGHT */}

<input
style={styles.input}
value={editForm.weight || ""}
onChange={(e)=>
setEditForm({...editForm,weight:e.target.value})
}
placeholder="Weight"
/>



{/* DESCRIPTION */}

<textarea
style={styles.input}
value={editForm.description || ""}
onChange={(e)=>
setEditForm({...editForm,description:e.target.value})
}
placeholder="Description"
/>



{/* BUTTONS */}

<div style={styles.modalActions}>


<button
style={styles.save}
onClick={updateProduct}
>
Save
</button>


<button
style={styles.cancel}
onClick={()=>setEditOpen(false)}
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
fontSize:22,
fontWeight:700,
marginBottom:16
},

card:{
display:"flex",
gap:12,
background:"#fff",
padding:12,
borderRadius:12,
marginBottom:12,
boxShadow:"0 3px 10px rgba(0,0,0,0.05)",
alignItems:"center"
},

image:{
width:70,
height:70,
objectFit:"contain",
borderRadius:8,
border:"1px solid #eee"
},

content:{
flex:1
},

name:{
fontSize:15,
fontWeight:600
},

price:{
fontSize:16,
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
padding:8,
borderRadius:8,
border:"1px solid #0B5ED7",
background:"#fff",
color:"#0B5ED7",
fontWeight:600
},

deleteBtn:{
flex:1,
padding:8,
borderRadius:8,
border:"1px solid #ef4444",
background:"#fff",
color:"#ef4444",
fontWeight:600
},



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
maxWidth:420,
maxHeight:"90vh",
overflowY:"auto"
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
marginTop:14
},

save:{
flex:1,
background:"#0B5ED7",
color:"#fff",
border:"none",
padding:12,
borderRadius:8,
fontWeight:600
},

cancel:{
flex:1,
background:"#e5e7eb",
border:"none",
padding:12,
borderRadius:8
},

imageGrid:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:6,
marginBottom:10
},

imageBox:{
aspectRatio:"1/1",
border:"1px solid #ddd",
borderRadius:8,
overflow:"hidden"
},

previewImg:{
width:"100%",
height:"100%",
objectFit:"cover"
},

noImg:{
fontSize:11,
display:"flex",
alignItems:"center",
justifyContent:"center",
height:"100%",
color:"#999"
}

};
