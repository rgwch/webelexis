<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import Medicationlist from "./Medicationlist.svelte";

const dummies = [
  {
    dosis: "1-1-1",
    bemerkung: "vor dem schnürzeln",
    patientid: "007",
    rezeptid: "008",
    dateFrom: "20210601063020",
    dateUntil: "20220103120000",
    anzahl: "5",
    artikel: "123123",
    prescdate: "20210601",
    prescriptor: "myself",
    _Artikel:{
      dscr:"Güldenkraut"
    }
  },
  {
    dosis: "1-0-1",
    bemerkung: "nach dem karcheln",
    patientid: "007",
    rezeptid: "008",
    dateFrom: "20210601063020",
    dateUntil: "20220103120000",
    anzahl: "1",
    artikel: "123124",
    prescdate: "20210601",
    prescriptor: "myself",
    _Artikel: {
      dscr: "Silberstein"
    }
  },
];
</script>

<Meta title="Components/Medicationlist" component="{Medicationlist}" />

<Template let:args>
  <Medicationlist {...args} />
</Template>

<Story name="Fixmedikation" args="{{ list: dummies, modality: '0' }}" />
<Story name="Rezept" args="{{ list: dummies, modality: '2' }}" />
