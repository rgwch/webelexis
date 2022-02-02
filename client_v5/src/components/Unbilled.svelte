<script lang="ts">
  import { Billing, type konsdef } from '../services/billing'
  import type {Tree} from '../models/tree'

  let patients:Array<Tree<konsdef>>=[]
  const biller = new Billing()
  biller.getBillables().then((result) => {
    return result.getChildren().then((pats)=>{
      patients=pats
    })
  })
  function getChildren(t:Tree<konsdef>){
    const ret=new Array<Tree<konsdef>>()
    let runner=t.first
    while(runner){
      ret.push(runner)
    }
    return ret
  }
  let cases:Array<Array<Tree<konsdef>>>=[]
  async function openPat(i){
    if(cases[i]){
      cases[i]=undefined
    }else{
    cases[i]=await patients[i].getChildren()
    }
  }
  let encounters:Array<Array<Array<Tree<konsdef>>>>=[]
  async function openCase(i,k){
    if(encounters[i][k]){
      encounters[i][k]=undefined
    }else{
      encounters[i][k]=await cases[i][k].getChildren()
    }

  }
</script>

<template>
  {#each patients as p,idx}
    <p on:click={()=>openPat(idx)}>
      {p.payload.lastname}
      {p.payload.firstname}
      {#if cases[idx]}
      {#each cases[idx] as f,k}
      <p on:click={()=>openCase(idx,k)}>
        {f.payload.falldatum}
        {f.payload.falltitel}
          {#each getChildren(f) as e}
            {e.payload.konsdatum}
          {/each}
      </p>
      {/each}
      {/if}
    </p>
  {/each}
</template>
