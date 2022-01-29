<script>
  import { Meta, Template, Story } from '@storybook/addon-svelte-csf'
  import Bills from './Bills.svelte'

  const dummies = [
    {
      rnnummer: '1',
      fallid: 'first case',
      rndatum: '20220110',
      rnstatus: '4',
      rndatumvon: '20210601',
      rndatumbis: '20211231',
      statusdatum: '20220110',
      betrag: '23420',
      fall: {
        patient: {
          bezeichnung1: 'Testperson',
          bezeichnung2: 'Armeswesen',
        },
      },
    },
    {
      rnnummer: '2',
      fallid: 'second case',
      rndatum: '20220115',
      rnstatus: '4',
      rndatumvon: '20210701',
      rndatumbis: '20211130',
      statusdatum: '20220115',
      betrag: '4780',
      fall: {
        patient: {
          bezeichnung1: 'Testarossa',
          bezeichnung2: 'Ferrari',
        },
      },
    },
  ]
</script>

<Meta title="Bills" component={Bills} />

<Template let:args>
  <Bills {...args} />
</Template>

<Story name="Rechnungen" args={{ bills: dummies }} />
