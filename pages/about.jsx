import { useEffect,useState } from "react";
import { supabase } from "../lib/supabase";

export default function About(){

const [data,setData]=useState(null);

useEffect(()=>{
load();
},[]);


async function load(){

const {data}=await supabase
.from("cms")
.select("*")
.eq("slug","about")
.single();

setData(data);

}


if(!data) return null;


return(

<div style={{padding:20}}>

<h1>{data.title}</h1>

<div>{data.content}</div>

</div>

);

}
