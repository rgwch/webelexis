<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import { _ } from "svelte-i18n";
  import TreeView from "./TreeView.svelte";
  import {Tree} from '../models/tree'

  const dummy = new Tree(null,null)
  const n1=new Tree(dummy,"eins")
  const n2=new Tree(dummy,"zwei")
  const n3=new Tree(n1,"ch1")
</script>

<Meta title="Widgets/Tree" component={Tree} />

<Template let:args>
  <TreeView {...args} />
</Template>

<Story
  name="Tree"
  args={{ tree:dummy,labelProvider: n=>n.payload}}
/>
