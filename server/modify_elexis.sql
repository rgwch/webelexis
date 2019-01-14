UPDATE user_ SET `id` = LOWER(`id`);

alter table agntermine
  change ID id varchar(127),
  modify ErstelltVon varchar(80);

alter table artikel modify id varchar(40),
	modify lieferantid varchar(40),
  modify extid varchar(40);

alter table artikel_details modify ARTICLE_ID varchar(40);

alter table artikelstamm_ch change ID id varchar(40),
	modify LieferantID varchar(40);

alter table at_medevit_elexis_gdt_protokoll change ID id varchar(40),
	modify PatientID varchar(40);
alter table at_medevit_elexis_impfplan change ID id varchar(40),
	modify Patient_ID varchar(40);
alter table at_medevit_elexis_inbox change ID id varchar(40);
alter table at_medevit_elexis_labmap change ID id varchar(40);
alter table at_medevit_elexis_loinc change ID id varchar(40);
alter table at_medevit_elexis_medindex_article change ID id varchar(40);
alter table at_medevit_elexis_medindex_product change ID id varchar(40);
alter table at_medevit_medelexis_vat_ch change ID id varchar(40);

alter table auf modify id varchar(40),
	modify patientid varchar(40),
	modify fallid varchar(40),
	modify BriefID varchar(40);

alter table bbs modify id varchar(40), modify authorid varchar(40);

alter table behandlungen modify id varchar(40),
	modify fallid varchar(40),
	modify mandantid varchar(40),
	modify rechnungsid varchar(40);

alter table behandlungen add Zeit char(8);

alter table behdl_dg_joint change ID id varchar(40),
	modify BehandlungsID varchar(40),
	modify DiagnoseID varchar(40);


alter table bestellung_entry change ID id varchar(40),
	modify ARTICLE_ID varchar(40),
	modify stock varchar(40),
	modify PROVIDER varchar(40);

alter table bestellungen change ID id varchar(80);


alter table bildanzeige change ID id varchar(40),
	modify PatID varchar(40);

alter table briefe modify id varchar(40),
	modify absenderid varchar(40),
	modify destid varchar(40),
	modify behandlungsid varchar(40),
	modify patientid varchar(40);

alter table ch_berchtold_privatrechnung
  change ID id varchar(40),
  modify subsystem varchar(40);

alter table ch_elexis_agenda_daymsg
  change ID id char(8);

alter table ch_elexis_arzttarif_ch_rfe
  change ID id varchar(40),
  modify konsID varchar(40);

alter table ch_elexis_arzttarife_ch_complementary
  change ID id varchar(40);

alter table ch_elexis_arzttarife_ch_physio
  change ID id varchar(49);

alter table ch_elexis_core_findings_condition
  change ID id varchar(40);

alter table ch_elexis_core_findings_encounter
  change ID id varchar(40);

alter table ch_elexis_core_findings_localcoding
  change ID id varchar(40),
  modify code varchar(40);

alter table ch_elexis_core_findings_observation
  change ID id varchar(40);

alter table ch_elexis_core_findings_procedurerequest
  change ID id varchar(40);

alter table ch_elexis_developer_resources_sampletable
  change ID id varchar(40),
  modify PatientID varchar(40);

alter table ch_elexis_eigendiagnosen
  change ID id varchar(40),
  modify parent varchar(40),
  modify code varchar(40);

alter table ch_elexis_icpc_encounter
  change ID id varchar(40),
  modify KONS varchar(40),
  modify EPISODE varchar(40);

alter table ch_elexis_icpc_episodes
  change ID id varchar(40),
  modify PatientID varchar(40);

alter table ch_elexis_icpc_episodes_diagnoses_link
  change ID id varchar(40),
  modify Episode varchar(40);

alter table ch_elexis_impfplan_vaccinations
  change ID id varchar(40),
  modify patientID varchar(40),
  modify vaccinationType varchar(40);

alter table ch_elexis_impfplan_vaccination_types
  change ID id varchar(40);

alter table ch_elexis_kassenbuch
change ID id varchar(40),
modify Nr varchar(40);

alter table ch_elexis_medikamente_bag_ext
  change ID id varchar(40);

alter table ch_elexis_medikamente_bag_interactions
  change ID id varchar(40),
  modify Subst1 varchar(40),
  modify Subst2 varchar(40),
  modify Contributor varchar(40);

alter table ch_elexis_medikamente_bag_joint
  change ID id varchar(40),
  modify product varchar(40),
  modify substance varchar(40);

alter table ch_elexis_medikamente_bag_substance
  change ID id varchar(40);


alter table ch_elexis_messages change ID id varchar(40),
	modify origin varchar(40),
	modify destination varchar(40);

alter table ch_elexis_messwerte_messwerte
  change ID id varchar(40),
  modify MessungID varchar(40),
  modify Name varchar(40),
  modify Wert varchar(40);

alter table ch_elexis_molemax
  change ID id varchar(40),
  modify patientID varchar(40),
  modify parentID varchar(40);

alter table ch_elexis_notes
  change ID id varchar(40),
  modify Parent varchar(40);

alter table ch_elexis_privatrechnung
  change ID id varchar(40),
  modify subsystem varchar(40);

alter table ch_elexis_stickynotes
  change ID id varchar(40),
  modify PatientID varchar(40);

alter table ch_medelexis_labortarif2009
  change ID id varchar(40);

alter table ch_medelexis_therapieplan_dispenses
  change ID id varchar(40),
  modify medicationID varchar(40);

alter table ch_medelexis_therapieplan_medication
  change ID id varchar(40),
  modify patientID varchar(40),
  modify problemID varchar(40);

alter table com_hilotec_elexis_messwerte_messungen
  change ID id varchar(40),
  modify PatientID varchar(40),
  modify TypName varchar(40);

alter table com_hilotec_elexis_messwerte_messwerte
  change ID id varchar(40),
  modify MessungID varchar(40),
  modify Name varchar(40),
  modify Wert varchar(40);

alter table config add deleted char(1);

alter table userconfig add deleted char(1);

alter table dbimage change ID id varchar(40);

alter table default_signatures
  change ID id varchar(40);


alter table diagnosen modify id varchar(40);

alter table eigenleistungen change ID id varchar(40);

alter table ek_preise modify id varchar(40);
alter table ek_preise add deleted char(1);

alter table elexisbefunde modify id varchar(40),
	modify patientid varchar(40);

alter table esrrecords change ID id varchar(40),
	modify RECHNUNGSID varchar(40),
	modify PATIENTID varchar(40),
	modify MANDANTID varchar(40);


alter table etiketten change ID id varchar(40),
	modify Image varchar(40);

alter table etiketten_objclass_link modify sticker varchar(40);

alter table etiketten_object_link modify obj varchar(40),
	modify etikette varchar(40);

alter table faelle modify id varchar(40),
	modify patientid varchar(40),
	modify garantid varchar(40),
	modify kostentrid varchar(40),
	modify grund varchar(255),
	modify diagnosen varchar(255);



alter table heap change ID id varchar(40);

alter table iatrix_problem
  change ID id varchar(40),
  modify PatientID varchar(40);

alter table iatrix_problem_behdl_joint
  change ID id varchar(40),
  modify ProblemID varchar(40),
  modify BehandlungsID varchar(40);

alter table iatrix_problem_dauermedikation_joint
  change ID id varchar(40),
  modify ProblemID varchar(40),
  modify DauermedikationID varchar(40);

alter table iatrix_problem_dg_joint
  change ID id varchar(40),
  modify ProblemID varchar(40),
  modify DiagnoseID varchar(40);

alter table icd10
  change ID id varchar(40),
  modify parent varchar(40);

alter table kontakt
  change telefon2 Telefon2 varchar(254);

alter table kontakt_adress_joint modify id varchar(40),
	modify myid varchar(40),
	modify otherid varchar(40),
	modify bezug varchar(255);

alter table kontakt_order_management change ID id varchar(40),
	modify KONTAKT_ID varchar(40);

alter table konto modify id varchar(40),
	modify patientid varchar(40),
	modify RechnungsID varchar(40),
	modify ZahlungsID varchar(40);

alter table labgroup_item_joint
  modify GroupID varchar(40),
  modify ItemID varchar(40);

alter table labgroups
  change ID id varchar(40);

alter table laborder
  change ID id varchar(40);


alter table laborwerte modify id varchar(40),
  modify patientid varchar(40),
  modify itemid varchar(40),
  modify OriginID varchar(40);

alter table laboritems modify id varchar(40),
  modify laborid varchar(40);

alter table leistungen
  change ID id varchar(40),
  modify behandlung varchar(40),
  modify leistg_code varchar(40),
  modify userID varchar(40);

alter table leistungsblock
  change ID id varchar(40),
  modify mandantid varchar(40);

alter table logs
  change ID id varchar(40),
  modify userID varchar(40);

alter table net_medshare_percentile_data
  change ID id varchar(40),
  modify PATIENT_ID varchar(40);

alter table net_medshare_percentile_patient
  change ID id varchar(40),
  modify PATIENT_ID varchar(40);

alter table net_medshare_percentile_refdata
  change ID id varchar(40);

alter table output_log
  change ID id varchar(40),
  modify ObjectID varchar(40);

alter table patient_artikel_joint
  modify id varchar(40),
  modify artikelid varchar(40),
  modify patientid varchar(40),
  modify REZEPTID varchar (40),
  modify prescriptor varchar(40);

alter table percentile
  change ID id varchar(40),
  modify PATIENT_ID varchar(40);

alter table percentile_ref_data
  change ID id varchar(40);

alter table rechnungen
  modify id varchar(40),
  modify fallid varchar(40),
  modify mandantid varchar(40);

alter table reminders
  modify id varchar(40),
  modify identid varchar(40),
  modify RESPONSIBLE varchar(40),
  modify OriginID varchar(40);

alter table reminders_responsible_link
  change ID id varchar(40),
  modify ReminderID varchar(40),
  modify ResponsibleID varchar(40);

alter table rezepte
  modify id varchar(40),
  modify patientid varchar(40),
  modify mandantid varchar(40),
  modify BriefID varchar(40);

alter table right_
  change ID id varchar(40);

alter table role
  change ID id varchar(40);

alter table role_right_joint
  change ID id varchar(40),
  modify ROLE_ID varchar(40);

alter table stock
  change ID id varchar(40),
  modify OWNER varchar(40),
  modify RESPONSIBLE varchar(40);

alter table stock_entry
  change ID id varchar(40),
  modify STOCK varchar(40),
  modify ARTICLE_ID varchar(40),
  modify PROVIDER varchar(40);

alter table tarmed
  change ID id varchar(40);

alter table tarmed_extension
  modify Code varchar(40),
  modify id varchar(40);

alter table traces
  modify workstation varchar(80);


alter table user_
  change ID id varchar(40),
  modify KONTAKT_ID varchar(40);

alter table userconfig
  modify UserID varchar(40);

alter table user_role_joint
  change ID id varchar(40),
  modify USER_ID varchar(40);

alter table verrechnetcopy
  change ID id varchar(40),
  modify RechnungId varchar(40),
  modify BehandlungId varchar(40),
  modify Leistg_code varchar(40),
  modify userID varchar(40);

alter table vk_preise
  modify id varchar(40);
alter table vk_preise add deleted char(1);

alter table xid
  change ID id varchar(40),
  modify object varchar(40);

alter table zahlungen
  modify id varchar(40),
  modify rechnungsid varchar(40);

insert into config(param,wert) values("webelexis","3.0.5")
