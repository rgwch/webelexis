<script lang="ts">
  import Card from "../widgets/Card.svelte";
  import LineInput from "../widgets/LineInput.svelte"
  import Radiobuttons from "../widgets/Radiobuttons.svelte";
  let p = 5;
  import FlexForm from "../widgets/Flexform.svelte";
  import type {FlexformConfig} from '../widgets/flexformtypes'
 
  const patdef:FlexformConfig={
    title: ()=>"Personaldaten",
    compact: true,
    attributes: [
      {
        attribute: "firstname",
        label: "Vorname",
        datatype: "string",
        sizehint:4,
      } ,{
        attribute: "lastname",
        label: "Nachname",
        datatype: "string",
        sizehint:4
      },{
        attribute: "birthdate",
        label: "Geburtsdatum",
        datatype: "date",
        sizehint:1
      },{
        attribute: "street",
        label: "Strasse",
        datatype: "string",
        sizehint:7
      },{
        attribute:"dummy",
        label: "",
        datatype:"string",
        sizehint:2
        
      }/*,{
        attribute: "zip",
        label: "Plz",
        datatype: "string",
        sizehint:2
      },{
        attribute: "place",
        label: "Ort",
        datatype: "string",
        sizehint:7
      },{
        attribute: "phone",
        label: "Telefon",
        datatype: "string",
        sizehint:3
      },{
        attribute: "mail",
        label: "E-Mail",
        datatype: "string",
        sizehint:6
      } */
    ]
  }
  let entity={}
</script>

<template>
  <div class="border-b border-gray-900/10 p-12">
    <h2 class="text-base font-semibold leading-7 text-gray-900">
      Patientenformular
    </h2>
    <p class="mt-1 text-sm leading-6 text-gray-600">
      Bitte füllen Sie das untenstehende Formular aus, wenn bisher noch nicht
      geschehen.
    </p>
  <FlexForm {entity} ff_cfg={patdef}></FlexForm>

    <!--form>
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-9">
        <div class="sm:col-span-1">
          <label
            for="gender"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Geschlecht</label
          >
          <Radiobuttons options={["m","w","d"]} value="w"></Radiobuttons> 
          <div class="mt-2">
            <select
              id="gender"
              name="gender"
              autocomplete="geschlecht"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            >
              <option>m</option>
              <option>w</option>
              <option>d</option>
            </select>
          </div>
        </div>

        <div class="sm:col-span-4">
          <label
            for="first-name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Vorname</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="first-name"
              id="first-name"
              autocomplete="given-name"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="sm:col-span-4">
          <label
            for="last-name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Nachname</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="last-name"
              id="last-name"
              autocomplete="family-name"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="col-span-full">
          <label
            for="street-address"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Strasse</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="street-address"
              id="street-address"
              autocomplete="street-address"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="sm:col-span-2">
          <label
            for="postal-code"
            class="block text-sm font-medium leading-6 text-gray-900">Plz</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="postal-code"
              id="postal-code"
              autocomplete="postal-code"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div class="sm:col-span-6">
          <label
            for="city"
            class="block text-sm font-medium leading-6 text-gray-900">Ort</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="city"
              id="city"
              autocomplete="address-level2"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="sm:col-span-3">
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >E-Mail</label
          >
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div class="sm:col-span-3">
            <LineInput label="Telefon"></LineInput>
        </div>
        <div class="sm:col-span-2">
          <label
            for="region"
            class="block text-sm font-medium leading-6 text-gray-900"
            >State / Province</label
          >
          <div class="mt-2">
            <input
              type="text"
              name="region"
              id="region"
              autocomplete="address-level1"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
      </div>
    </form -->
    <p class="pt-5">Ich bestätige mit meiner Unterschrift, dass ich mit der Bearbeitung meiner Daten, den Zugriffen auf die Daten
        durch die Ärztin oder den Arzt sowie der Weitergabe der Daten an Dritte gemäss Patienteninformation auf der
        folgenden Seite einverstanden bin.
        Ich bin mir möglicher Risiken des Datenaustausches von besonders schützenswerten Personendaten (mögliche
        Einsicht von unberechtigten Dritten bei unsicheren Kommunikationswegen) sowie meiner Rechte bewusst und
        gebe mein Einverständnis für den gegenseitigen Kontakt zwischen meiner meinem Arzt und mir als Patient/in
        durch die oben angegebenen Kontaktinformationen. Patienteninformationen werden seitens der Arztpraxis
        ausschliesslich über gesicherte Kommunikationswege weitergegeben. Ich bin mir bewusst, dass Angaben, die auf
        meinen Wunsch per unverschlüsselter Mail an mich gesendet werden (Antworten auf Mail-Anfragen,
        Untersuchungsbefunde), nicht speziell gegen unbefugte Einsicht gesichert sind.
        Das Bundesgesetz über die Krankenversicherung (KVG) sieht vor, dass Patientinnen und Patienten eine Kopie der
        Arztrechnung erhalten müssen. In unserer Praxis werden KVG-Rechnungen grundsätzlich direkt an Patienten (nie
        an die Krankenkasse) gesendet.
        Ort, Datum
        Unterschrift
        Termine, die Sie ohne Abs</p>
  </div>
</template>
