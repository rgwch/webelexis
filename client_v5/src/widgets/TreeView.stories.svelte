<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { _ } from "svelte-i18n";
  import TreeView from "./TreeView.svelte";
  import {Tree} from '../models/tree'
  const comparator=(a,b)=>{return a.localeCompare(b)}

  const dummy = new Tree(null,null)
  const n1=new Tree(dummy,"eins")
  const n2=new Tree(dummy,"zwei")
  n1.insert("ch1",comparator)
</script>

<Meta title="Widgets/Tree" component={TreeView} />

<Template let:args>
  <TreeView {...args} />
</Template>

<Story
  name="Tree"
  args={{ tree:dummy,labelProvider: n=>n.payload}}
/>
