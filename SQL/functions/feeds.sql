-- FUNCTION: public.feeds(integer)

-- DROP FUNCTION public.feeds(integer);
DROP FUNCTION if exists public.feeds(integer);
CREATE OR REPLACE FUNCTION public.feeds(
	compid integer)
    RETURNS TABLE(feeds varchar(500), beforevalue varchar(500), aftervalue varchar(500), cdate timestamp without time zone) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
    f1 record;
    f2 record;
begin
	f2 := row(null);
  drop table if exists biolabsfeed;
  CREATE TEMP table biolabsfeed (feedmsg varchar(500),beforeValue varchar(500),aftervalue varchar (500),cdate timestamp without time zone);

    for f1 in select *
           from HISTORY_DIFF
           where "comnpanyId"=compId
           order by "cdate" desc
           limit 10
    loop
               
        if f2 is NULL then
            f2 := f1;
            continue;
        end if;
		if ((f2.funding != f1.funding OR f1."funding" is NULL) AND f2."funding" is NOT NULL) then
			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Funding changed ', f1."funding", f2."funding", f2."cdate");
		end if;
		if ((f2."fundingsrcname" != f1."fundingsrcname" OR f1."fundingsrcname" is NULL) AND f2."funding" is NOT NULL) then
			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Funding Source changed ', f1."fundingsrcname" ::text, f2."fundingsrcname" ::text, f2."cdate");
		end if;
		if ((f2."noOfFullEmp" != f1."noOfFullEmp" OR f1."noOfFullEmp" is NULL) AND f2."noOfFullEmp" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Number of employees changed ' , f1."noOfFullEmp", f2."noOfFullEmp" ::text , f2."cdate");
        end if;
        if ((f2."companySize" != f1."companySize" OR f1."companySize" is NULL) AND f2."companySize" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Company size changed ',(CASE WHEN f1."companySize" is NULL THEN '0' ELSE f1."companySize" END), (CASE WHEN f2."companySize" is NULL THEN '0' ELSE f2."companySize" END) , f2."cdate");
        end if;
		if ((f2."otherFundingSource" != f1."otherFundingSource" OR f1."otherFundingSource" is NULL) AND f2."otherFundingSource" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate")  VALUES ('Funding Source changed ',(CASE WHEN ((f1."otherFundingSource" ='') OR (f1."otherFundingSource" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherFundingSource" END) ,f2."otherFundingSource" , f2."cdate");
        end if;
        if ((f2."industryname" != f1."industryname" OR f1."industryname" is NULL) AND f2."industryname" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Industry changed ' , f1."industryname" ::text , f2."industryname" ::text , f2."cdate");
        end if;
		if ((f2."modalityname" != f1."modalityname" OR f1."modalityname" is NULL) AND f2."funding" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Modality changed ', f1."modalityname" ::text , f2."modalityname" ::text , f2."cdate");
        end if;
		if ((f2."companyName" != f1."companyName" OR f1."companyName" is NULL) AND f2."companyName" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Company name changed ',  f1."companyName" , f2."companyName" , f2."cdate");
        end if;
		if ((f2."sitename" != f1."sitename" OR f1."sitename" is NULL) AND f2."sitename" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Site name changed ' , f1."sitename" ::text, f2."sitename" ::text, f2."cdate");
        end if;
		if ((f2."bsourcesname" != f1."bsourcesname" OR f1."bsourcesname" is NULL) AND f2."bsourcesname" is NOT NULL) then
 			INSERT INTO biolabsfeed  ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Biolabs source changed ' ,f1."bsourcesname" ::text , f2."bsourcesname" ::text , f2."cdate");
        end if;
		if ((f2."otherBiolabsSources" != f1."otherBiolabsSources" OR f1."otherBiolabsSources" is NULL) AND f2."otherBiolabsSources" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Other Biolabs source changed ' , (CASE WHEN ((f1."otherBiolabsSources" ='') OR (f1."otherBiolabsSources" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherBiolabsSources" ::text END) , f2."otherBiolabsSources" ::text , f2."cdate");
        end if;
		if ((f2."techstagename" != f1."techstagename" OR f1."techstagename" is NULL) AND f2."techstagename" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate")  VALUES ('Stage of technology changed ' ,f1."techstagename" ::text ,f2."techstagename" ::text , f2."cdate");
        end if;
		if ((f2."technology" != f1."technology" OR f1."technology" is NULL) AND f2."technology" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Technology Summary changed ' , f1."technology" ::text ,  f2."technology" ::text , f2."cdate");
        end if;
		if ((f2."rAndDPath" != f1."rAndDPath" OR f1."rAndDPath" is NULL) AND f2."rAndDPath" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('R&D path & commercialization plan changed ' , (CASE WHEN ((f1."rAndDPath" ='') OR (f1."rAndDPath" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."rAndDPath" ::text END),  f2."rAndDPath" ::text , f2."cdate");
        end if;
		if ((f2."foundedPlace" != f1."foundedPlace" OR f1."foundedPlace" is NULL) AND f2."foundedPlace" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Company founded place changed ' ,(CASE WHEN ((f1."foundedPlace" ='') OR (f1."foundedPlace" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."foundedPlace" ::text END), f2."foundedPlace" ::text , f2."cdate");
        end if;
		if ((f2."otherCompanyStage" != f1."otherCompanyStage" OR f1."otherCompanyStage" is NULL) AND f2."otherCompanyStage" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Stage of technology changed ',(CASE WHEN ((f1."otherCompanyStage" ='') OR (f1."otherCompanyStage" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherCompanyStage" END) , f2."otherCompanyStage" ::text, f2."cdate");
        end if;
		if ((f2."intellectualProperty" != f1."intellectualProperty" OR f1."intellectualProperty" is NULL) AND f2."intellectualProperty" is NOT NULL) then
			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Intellectual property related to your technology changed ' ,
			CASE WHEN (f1."intellectualProperty" = '1') THEN 'Yes, exclusively licensed'  
				 WHEN (f1."intellectualProperty" = '2') THEN 'Yes, non-exclusively licensed'
  				 WHEN (f1."intellectualProperty" = '3') THEN 'Yes, assigned to our company directly'
  				 WHEN (f1."intellectualProperty" = '4' ) THEN 'NO'
				 WHEN (f1."intellectualProperty" = '9999' ) THEN 'Other'
				 WHEN ((f1."intellectualProperty" ='') OR (f1."intellectualProperty" is NULL)) THEN 'INITIALIZED_WITH_NULL'
   				 ELSE f1."intellectualProperty" END,
 			CASE WHEN (f2."intellectualProperty" = '1') THEN 'Yes, exclusively licensed'  
				 WHEN (f2."intellectualProperty" = '2') THEN 'Yes, non-exclusively licensed'
  				 WHEN (f2."intellectualProperty" = '3') THEN 'Yes, assigned to our company directly'
  				 WHEN (f2."intellectualProperty" = '4' ) THEN 'NO'
				 WHEN (f2."intellectualProperty" = '9999' ) THEN 'Other'
				 WHEN ((f2."intellectualProperty" ='') OR (f2."intellectualProperty" is NULL)) THEN 'INITIALIZED_WITH_NULL'
   				 ELSE f2."intellectualProperty" END
				,f2."cdate");
        end if;
		if ((f2."otherIntellectualProperty" != f1."otherIntellectualProperty" OR f1."otherIntellectualProperty" is NULL) AND f2."otherIntellectualProperty" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Intellectual property related to your technology changed  ',  (CASE WHEN ((f1."otherIntellectualProperty" ='') OR (f1."otherIntellectualProperty" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherIntellectualProperty" END) ,f2."otherIntellectualProperty" ::text, f2."cdate");
        end if;
		if ((f2."isAffiliated" != f1."isAffiliated" OR f1."isAffiliated" is NULL) AND f2."isAffiliated" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Affiliated changed ' , (CASE WHEN f1."isAffiliated" = true THEN 'Yes' ELSE 'No' END) ,(CASE WHEN f2."isAffiliated" = true THEN 'Yes' ELSE 'No' END) ,  f2."cdate");
        end if;
		if ((f2."affiliatedInstitution" != f1."affiliatedInstitution" OR f1."affiliatedInstitution" is NULL) AND f2."affiliatedInstitution" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Affiliated Institution changed ' , (CASE WHEN ((f1."affiliatedInstitution" ='') OR (f1."affiliatedInstitution" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."affiliatedInstitution" END) ,f2."affiliatedInstitution",f2."cdate");
        end if;
		if ((f2."elevatorPitch" != f1."elevatorPitch" OR f1."elevatorPitch" is NULL) AND f2."elevatorPitch" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Elevator Pitch changed ' , (CASE WHEN ((f1."elevatorPitch" ='') OR (f1."elevatorPitch" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."elevatorPitch" END) , f2."elevatorPitch" ::text , f2."cdate");
        end if;
		if ((f2."technologyPapersPublished" != f1."technologyPapersPublished" OR f1."technologyPapersPublished" is NULL) AND f2."technologyPapersPublished" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Published papers related to your technology changed ' , (CASE WHEN f1."technologyPapersPublished" = true THEN 'Yes' ELSE 'No' END), (CASE WHEN f2."technologyPapersPublished" = true THEN 'Yes' ELSE 'No' END) ,  f2."cdate");
        end if;
		if ((f2."patentsFiledGranted" != f1."patentsFiledGranted" OR f1."patentsFiledGranted" is NULL) AND f2."patentsFiledGranted" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Patents filed & granted changed ' , f1."patentsFiledGranted" ::text , f2."patentsFiledGranted" ::text, f2."cdate");
        end if;
		if ((f2."patentsFiledGrantedDetails" != f1."patentsFiledGrantedDetails" OR f1."patentsFiledGrantedDetails" is NULL) AND f2."patentsFiledGrantedDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Patents filed & granted changed ' , f1."patentsFiledGrantedDetails" ::text ,f2."patentsFiledGranted" ::text,  f2."cdate");
        end if;
		if ((f2."academiaPartnerships" != f1."academiaPartnerships" OR f1."academiaPartnerships" is NULL) AND f2."academiaPartnerships" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Recognized partnerships with academia changed ' ,(CASE WHEN f1."academiaPartnerships" = true THEN 'Yes' ELSE 'No' END) , (CASE WHEN f2."academiaPartnerships" = true THEN 'Yes' ELSE 'No' END) ,  f2."cdate");
        end if;
		if ((f2."academiaPartnershipDetails" != f1."academiaPartnershipDetails" OR f1."academiaPartnershipDetails" is NULL) AND f2."academiaPartnershipDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Description for recognized partnerships with academia changed ' , f1."academiaPartnershipDetails" ::text , f2."academiaPartnershipDetails" ::text , f2."cdate");
        end if;
		if ((f2."industryPartnerships" != f1."industryPartnerships" OR f1."industryPartnerships" is NULL) AND f2."industryPartnerships" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Recognized partnerships with industry changed ' , (CASE WHEN f1."industryPartnerships" = true THEN 'Yes' ELSE 'No' END) ,  (CASE WHEN f2."industryPartnerships" = true THEN 'Yes' ELSE 'No' END) ,  f2."cdate");
        end if;
		if ((f2."industryPartnershipsDetails" != f1."industryPartnershipsDetails" OR f1."industryPartnershipsDetails" is NULL) AND f2."industryPartnershipsDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Description for recognized partnerships with industry changed ' , f1."industryPartnershipsDetails" ::text , f2."industryPartnershipsDetails" ::text , f2."cdate");
        end if;
		
        f2 := f1;
           end loop;
		  
	return query select * from biolabsfeed order by "cdate" desc limit 10;
end;
$BODY$;

