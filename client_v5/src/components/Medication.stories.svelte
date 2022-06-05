<script>
import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
import Medication from "./Medication.svelte";

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
  },
];
</script>

<Meta title="Components/Medication" component="{Medication}" />

<Template let:args>
  <Medication {...args} />
</Template>

<Story name="Medikation" args="{{ list: dummies, modality: '0' }}" />
