<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { _ } from "svelte-i18n";
  import TreeView from "./TreeView.svelte";
  import {Tree} from '../models/tree'
  const comparator=(a,b)=>{return a.localeCompare(b)}

  const dummy = new Tree(null,null)
  const n1=dummy.insert("eins",comparator)
  dummy.insert("zwei",comparator)
  n1.insert("ch1",comparator)
</script>

<Meta title="Widgets/Tree" component={Tree} />

<Template let:args>
  <TreeView {...args} />
</Template>

<Story
  name="Tree"
  args={{ tree:dummy,labelProvider: n=>n.payload}}
/>
