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
  // n1.insert("ch1",comparator)
</script>

<Meta title="Widgets/Tree" component={TreeView} />

<Template let:args>
  <TreeView {...args} />
</Template>

<Story
  name="Tree"
  args={{ tree:dummy,labelProvider: n=>n.payload}}
/>
