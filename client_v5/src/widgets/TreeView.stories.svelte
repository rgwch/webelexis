<script lang="ts">
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { _ } from "svelte-i18n";
  import TreeView from "./TreeView.svelte";
  import {Tree} from '../models/tree'
  const comparator=(a,b)=>{return a.localeCompare(b)}

  const dummy = new Tree<string>(null,null)
  const n1=new Tree<string>(dummy,"eins")
  const n2=new Tree<string>(dummy,"zwei")
    n1.setPayload("eins")
    n2.setPayload("zwei")
   const ch1=n1.insert("ch1",comparator)
   ch1.setPayload("child of eins")
   const gch1=ch1.insert("gch1",comparator)
   gch1.setPayload("grandchild of eins")
   
  const trees=dummy.getChildren()
</script>

<Meta title="Widgets/Tree" component={TreeView} />

<Template let:args>
  <TreeView {...args} />
</Template>

<Story
  name="Tree"
  args={{ trees,labelProvider: n=>n.payload}}
/>
