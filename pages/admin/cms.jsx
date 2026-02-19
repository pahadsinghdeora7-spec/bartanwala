import { useEffect, useState } from "react";
import Head from "next/head";
import { supabase } from "../../lib/supabase";

export default function AdminCMS(){

const [pages,setPages]=useState([]);
const [edit,setEdit]=useState(null);


useEffect(()=>{
load();
},[]);


async function load(){

const {data}=await supabase
.from("cms")
.select("*")
.order("slug");

setPages(data||[]);

}


async function save(){

await supabase
.from("cms")
.update({

title:edit.title,
content:edit.content

})
.eq("id",edit.id);

setEdit(null);
load();

alert("Saved");

}


return(

<>
<Head>
<title>CMS</title>
</Head>


<div style={{padding:20}}>

<h2>CMS Pages</h2>


{pages.map(p=>(

<div key={p.id}
style={{
background:"#fff",
padding:16,
marginBottom:12,
borderRadius:10
}}>

<h3>{p.title}</h3>

<button
onClick={()=>setEdit(p)}
>
Edit
</button>

</div>

))}



{edit && (

<div
style={{
position:"fixed",
inset:0,
background:"rgba(0,0,0,.4)"
}}>

<div
style={{
background:"#fff",
padding:20,
margin:20
}}>

<h3>Edit {edit.title}</h3>

<input
value={edit.title}
onChange={e=>
setEdit({...edit,title:e.target.value})
}
style={{width:"100%",marginBottom:10}}
/>


<textarea
value={edit.content}
onChange={e=>
setEdit({...edit,content:e.target.value})
}
style={{
width:"100%",
height:200
}}
/>


<button onClick={save}>
Save
</button>

<button onClick={()=>setEdit(null)}>
Cancel
</button>


</div>

</div>

)}


</div>

</>

);

}
