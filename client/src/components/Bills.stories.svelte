<script>
  import { Meta, Template, Story } from "@storybook/addon-svelte-csf";
  import Bills from "./Bills.svelte";

  const dummies = [
    {
      rnnummer: "1",
      fallid: "first case",
      rndatum: "20220110",
      rnstatus: "4",
      rndatumvon: "20210601",
      rndatumbis: "20211231",
      statusdatum: "20220110",
      betrag: "23420",
      _Fall: {
        _Patient: {
          bezeichnung1: "Testperson",
          bezeichnung2: "Armeswesen",
        },
        gesetz: "illegal"
      },
    },
    {
      rnnummer: "2",
      fallid: "second case",
      rndatum: "20220115",
      rnstatus: "4",
      rndatumvon: "20210701",
      rndatumbis: "20211130",
      statusdatum: "20220115",
      betrag: "4780",
      _Fall: {
        _Patient: {
          bezeichnung1: "Testarossa",
          bezeichnung2: "Ferrari",
        },
        gesetz: "whatever"
      },
    },
  ];
</script>

<Meta title="Components/Bills" component={Bills} />

<Template let:args>
  <Bills {...args} />
</Template>

<Story name="Rechnungen" args={{ bills: dummies }} />
