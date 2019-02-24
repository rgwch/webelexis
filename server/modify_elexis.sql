UPDATE user_ SET `id` = LOWER(`id`);

alter table agntermine
  modify id varchar(127),
  modify erstelltvon varchar(80);

alter table artikel modify id varchar(40),
	modify lieferantid varchar(40),
  modify extid varchar(40);

alter table artikel_details modify article_id varchar(40);

alter table artikelstamm_ch modify id varchar(40),
	modify lieferantid varchar(40);

alter table at_medevit_elexis_gdt_protokoll modify id varchar(40),
	modify patientid varchar(40);
alter table at_medevit_elexis_impfplan modify id varchar(40),
	modify patient_id varchar(40);
alter table at_medevit_elexis_inbox modify id varchar(40);
alter table at_medevit_elexis_labmap modify id varchar(40);
alter table at_medevit_elexis_loinc modify id varchar(40);
alter table at_medevit_elexis_medindex_article modify id varchar(40);
alter table at_medevit_elexis_medindex_product modify id varchar(40);
alter table at_medevit_medelexis_vat_ch modify id varchar(40);

alter table auf modify id varchar(40),
	modify patientid varchar(40),
	modify fallid varchar(40),
	modify briefid varchar(40);

alter table bbs modify id varchar(40), modify authorid varchar(40);

alter table behandlungen modify id varchar(40),
	modify fallid varchar(40),
	modify mandantid varchar(40),
	modify rechnungsid varchar(40);

alter table behandlungen add zeit char(8);

alter table behdl_dg_joint modify id varchar(40),
	modify behandlungsid varchar(40),
	modify diagnoseid varchar(40);


alter table bestellung_entry
  drop foreign key fk_bestellung_entry_bestellung_id,
  modify id varchar(40),
  modify bestellung varchar(80) not null collate utf8_general_ci,
	modify article_id varchar(40),
	modify stock varchar(40),
	modify provider varchar(40);

alter table bestellungen modify id varchar(80) collate utf8_general_ci;

#ALTER TABLE bestellung_entry
#	ADD CONSTRAINT fk_bestellung_entry_bestellung_id
# FOREIGN KEY (bestellung) REFERENCES bestellungen (id);


alter table bildanzeige modify id varchar(40),
	modify patid varchar(40);

alter table briefe modify id varchar(40),
	modify absenderid varchar(40),
	modify destid varchar(40),
	modify behandlungsid varchar(40),
	modify patientid varchar(40);

alter table ch_berchtold_privatrechnung
  modify id varchar(40),
  modify subsystem varchar(40);

alter table ch_elexis_agenda_daymsg
  modify id char(8);

alter table ch_elexis_arzttarif_ch_rfe
  modify id varchar(40),
  modify konsid varchar(40);

alter table ch_elexis_arzttarife_ch_complementary
  modify id varchar(40);

alter table ch_elexis_arzttarife_ch_physio
  modify id varchar(40);

alter table ch_elexis_core_findings_condition
  modify id varchar(40);

alter table ch_elexis_core_findings_encounter
  modify id varchar(40);

alter table ch_elexis_core_findings_localcoding
  modify id varchar(40),
  modify code varchar(40);

alter table ch_elexis_core_findings_observation
  modify id varchar(40);

alter table ch_elexis_core_findings_procedurerequest
  modify id varchar(40);

alter table ch_elexis_developer_resources_sampletable
  modify id varchar(40),
  modify patientid varchar(40);

alter table ch_elexis_eigendiagnosen
  modify id varchar(40),
  modify parent varchar(40),
  modify code varchar(40);

alter table ch_elexis_icpc_encounter
  modify id varchar(40),
  modify kons varchar(40),
  modify episode varchar(40);

alter table ch_elexis_icpc_episodes
  modify id varchar(40),
  modify patientid varchar(40);

alter table ch_elexis_icpc_episodes_diagnoses_link
  modify id varchar(40),
  modify episode varchar(40);

alter table ch_elexis_impfplan_vaccinations
  modify id varchar(40),
  modify patientid varchar(40),
  modify vaccinationType varchar(40);

alter table ch_elexis_impfplan_vaccination_types
  modify id varchar(40);

alter table ch_elexis_kassenbuch
  modify id varchar(40),
  modify nr varchar(40);

alter table ch_elexis_medikamente_bag_ext
  modify id varchar(40);

alter table ch_elexis_medikamente_bag_interactions
  modify id varchar(40),
  modify subst1 varchar(40),
  modify subst2 varchar(40),
  modify contributor varchar(40);

alter table ch_elexis_medikamente_bag_joint
  modify id varchar(40),
  modify product varchar(40),
  modify substance varchar(40);

alter table ch_elexis_medikamente_bag_substance
  modify id varchar(40);


alter table ch_elexis_messages change ID id varchar(40),
	modify origin varchar(40),
	modify destination varchar(40);

alter table ch_elexis_messwerte_messwerte
  modify id varchar(40),
  modify messungid varchar(40),
  modify name varchar(40),
  modify wert varchar(40);

alter table ch_elexis_molemax
  modify id varchar(40),
  modify patientid varchar(40),
  modify parentid varchar(40);

alter table ch_elexis_notes
  modify id varchar(40),
  modify parent varchar(40);

alter table ch_elexis_privatrechnung
  modify id varchar(40),
  modify subsystem varchar(40);

alter table ch_elexis_stickynotes
  modify id varchar(40),
  modify patientid varchar(40);

alter table ch_medelexis_labortarif2009
  modify id varchar(40);

alter table ch_medelexis_therapieplan_dispenses
  modify id varchar(40),
  modify medicationid varchar(40);

alter table ch_medelexis_therapieplan_medication
  modify id varchar(40),
  modify patientid varchar(40),
  modify problemid varchar(40);

alter table com_hilotec_elexis_messwerte_messungen
  modify id varchar(40),
  modify patientid varchar(40),
  modify typname varchar(40);

alter table com_hilotec_elexis_messwerte_messwerte
  modify id varchar(40),
  modify messungid varchar(40),
  modify name varchar(40),
  modify wert varchar(40);

alter table config add deleted char(1);

alter table userconfig add deleted char(1);

alter table dbimage modify id varchar(40);

alter table default_signatures
  modify id varchar(40);

alter table diagnosen modify id varchar(40);

alter table eigenleistungen modify id varchar(40);

alter table ek_preise modify id varchar(40);
alter table ek_preise add deleted char(1);

alter table elexisbefunde modify id varchar(40),
	modify patientid varchar(40);

alter table esrrecords modify id varchar(40),
	modify rechnungsid varchar(40),
	modify patientid varchar(40),
	modify mandantid varchar(40);


alter table etiketten modify id varchar(40),
	modify image varchar(40);

alter table etiketten_objclass_link modify sticker varchar(40);

alter table etiketten_object_link modify obj varchar(40),
	modify etikette varchar(40);

alter table faelle modify id varchar(40),
	modify patientid varchar(40),
	modify garantid varchar(40),
	modify kostentrid varchar(40),
	modify grund varchar(255),
	modify diagnosen varchar(255);



alter table heap modify id varchar(40);

alter table iatrix_problem
  modify id varchar(40),
  modify patientid varchar(40);

alter table iatrix_problem_behdl_joint
  modify id varchar(40),
  modify problemid varchar(40),
  modify behandlungsid varchar(40);

alter table iatrix_problem_dauermedikation_joint
  modify id varchar(40),
  modify problemid varchar(40),
  modify dauermedikationid varchar(40);

alter table iatrix_problem_dg_joint
  modify id varchar(40),
  modify problemid varchar(40),
  modify diagnoseid varchar(40);

alter table icd10
  modify id varchar(40),
  modify parent varchar(40);

alter table zusatzadresse drop foreign key fk_zusatzadresse_kontakt_id;

alter table kontakt
  modify id varchar(40) collate utf8_general_ci,
  modify telefon2 varchar(254);

alter table kontakt_adress_joint modify id varchar(40),
	modify myid varchar(40),
	modify otherid varchar(40),
	modify bezug varchar(255);

alter table kontakt_order_management modify id varchar(40),
	modify kontakt_id varchar(40);

alter table konto modify id varchar(40),
	modify patientid varchar(40),
	modify rechnungsid varchar(40),
	modify zahlungsid varchar(40);

alter table labgroup_item_joint
  modify groupid varchar(40),
  modify itemid varchar(40);

alter table labgroups
  modify id varchar(40);

alter table laborder
  modify id varchar(40);


alter table laborwerte modify id varchar(40),
  modify patientid varchar(40),
  modify itemid varchar(40),
  modify originid varchar(40);

alter table laboritems modify id varchar(40),
  modify laborid varchar(40);

alter table leistungen
  modify id varchar(40),
  modify behandlung varchar(40),
  modify leistg_code varchar(40),
  modify userid varchar(40);

alter table leistungsblock
  modify id varchar(40),
  modify mandantid varchar(40);

alter table logs
  modify id varchar(40),
  modify userid varchar(40);

alter table net_medshare_percentile_data
  modify id varchar(40),
  modify patient_id varchar(40);

alter table net_medshare_percentile_patient
  modify id varchar(40),
  modify patient_id varchar(40);

alter table net_medshare_percentile_refdata
  modify id varchar(40);

alter table output_log
  modify id varchar(40),
  modify objectid varchar(40);

alter table patient_artikel_joint
  modify id varchar(40),
  modify artikelid varchar(40),
  modify patientid varchar(40),
  modify rezeptid varchar (40),
  modify prescriptor varchar(40);

alter table percentile
  modify id varchar(40),
  modify patient_id varchar(40);

alter table percentile_ref_data
  modify id varchar(40);

alter table rechnungen
  modify id varchar(40),
  modify fallid varchar(40),
  modify mandantid varchar(40);

alter table reminders
  modify id varchar(40),
  modify identid varchar(40),
  modify responsible varchar(40),
  modify originid varchar(40);

alter table reminders_responsible_link
  modify id varchar(40),
  modify reminderid varchar(40),
  modify responsibleid varchar(40);

alter table rezepte
  modify id varchar(40),
  modify patientid varchar(40),
  modify mandantid varchar(40),
  modify briefid varchar(40);

alter table right_
  modify id varchar(40);

alter table role
  modify id varchar(40);

alter table role_right_joint
  modify id varchar(40),
  modify role_id varchar(40);


alter table  stock_entry drop foreign key fk_stock_entry_stock_id;

alter table stock
  modify id varchar(40) collate utf8_general_ci,
  modify owner varchar(40),
  modify responsible varchar(40);

alter table stock_entry
  modify id varchar(40),
  modify stock varchar(40) not null collate utf8_general_ci,
  modify article_id varchar(40),
  modify provider varchar(40);

# ALTER TABLE stock_entry
#	ADD CONSTRAINT fk_stock_entry_stock_id FOREIGN KEY (stock)
# REFERENCES stock (id);

alter table tarmed
  modify id varchar(40);

alter table tarmed_extension
  modify code varchar(40),
  modify id varchar(40);

alter table traces
  modify workstation varchar(80);


alter table user_
  modify id varchar(40),
  modify kontakt_id varchar(40);

alter table userconfig
  modify userid varchar(40);

alter table user_role_joint
  modify id varchar(40),
  modify user_id varchar(40);

alter table verrechnetcopy
  modify id varchar(40),
  modify rechnungid varchar(40),
  modify behandlungid varchar(40),
  modify leistg_code varchar(40),
  modify userid varchar(40);

alter table vk_preise
  modify id varchar(40);
alter table vk_preise add deleted char(1);

alter table xid
  modify id varchar(40),
  modify object varchar(40);

alter table zahlungen
  modify id varchar(40),
  modify rechnungsid varchar(40);

alter table zusatzadresse
  modify id varchar(40),
  modify kontakt_id varchar(40) collate utf8_general_ci;

# ALTER TABLE zusatzadresse ADD CONSTRAINT
# fk_zusatzadresse_kontakt_id
#  FOREIGN KEY (kontakt_id) REFERENCES kontakt(id);

CREATE OR REPLACE VIEW rights_per_role AS SELECT
	r.id AS role_id, ri.id AS right_id
FROM
	role r
	LEFT JOIN role_right_joint rrj
		ON r.id = rrj.role_id
	LEFT JOIN right_ ri
		ON rrj.id = ri.id
ORDER BY r.id;

CREATE OR REPLACE VIEW rights_per_user AS SELECT
	u.id AS user_id, ri.id AS right_id, ri.name AS right_name
FROM
	user_ u
	LEFT JOIN user_role_joint urj
		ON u.id = urj.user_id
	LEFT JOIN role r
		ON urj.id = r.id
	LEFT JOIN role_right_joint rrj
		ON r.id = rrj.role_id
	LEFT JOIN right_ ri
		ON rrj.id = ri.id
ORDER BY u.id;


