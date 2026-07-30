"use client";

import { useState } from "react";

const items = [

"Technician arrived on time",

"Technician behaved professionally",

"Issue was completely resolved",

"Work area was cleaned",

"Pricing was transparent",

"Technician explained the repair",

"I am satisfied with the service"

];

export default function ChecklistSection(){

const [checked,setChecked]=useState([]);

const toggle=(item)=>{

if(checked.includes(item))

setChecked(checked.filter(i=>i!==item));

else

setChecked([...checked,item]);

};

return(

<section className="bg-white rounded-3xl shadow-xl p-10 mb-10">

<span className="uppercase tracking-widest text-orange-500 font-semibold">

Quality Checklist

</span>

<h2 className="text-4xl font-bold mt-3">

Service Verification

</h2>

<p className="text-gray-500 mt-3">

Please verify the following points.

</p>

<div className="grid md:grid-cols-2 gap-5 mt-10">

{items.map((item,index)=>(

<label

key={index}

className={`border-2 rounded-2xl p-5 cursor-pointer transition

${checked.includes(item)

?"border-orange-500 bg-orange-50"

:"border-gray-200 hover:border-orange-300"

}

`}

>

<div className="flex items-center gap-4">

<input

type="checkbox"

checked={checked.includes(item)}

onChange={()=>toggle(item)}

className="h-5 w-5 accent-orange-500"

/>

<span className="font-medium">

{item}

</span>

</div>

</label>

))}

</div>

</section>

);

}