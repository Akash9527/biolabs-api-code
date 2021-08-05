
-- USE below command to run the function
-- SELECT feeds(72);

-- USE below command to check temp table anddrop
-- select * from biolabsfeed
-- drop table if exists biolabsfeed;

-- USE below command drop the function
-- DROP FUNCTION feeds

CREATE OR REPLACE FUNCTION public.feeds(
	compid integer)
    RETURNS TABLE(feeds varchar(500), beforevalue varchar(500) , aftervalue varchar(500), cdate varchar(100)) 
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
  CREATE TEMP table biolabsfeed (feedmsg varchar(500),beforeValue varchar(500),aftervalue varchar (500),cdate varchar(100));

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
			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Funding changed ', f1."funding", f2."funding", to_char(f2."cdate", 'MM/dd/yyyy'));
		end if;
-- 		if ((f2."fundingSource" != f1."fundingSource" OR f1."fundingSource" is NULL) AND f2."funding" is NOT NULL) then
-- 			INSERT INTO biolabsfeed VALUES ('Funding Source changed to ' , f2."fundingSource" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
-- 		end if;
		if ((f2."fundingsrcname" != f1."fundingsrcname" OR f1."fundingsrcname" is NULL) AND f2."funding" is NOT NULL) then
			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Funding Source changed ', f1."fundingsrcname" ::text, f2."fundingsrcname" ::text, to_char(f2."cdate", 'MM/dd/yyyy'));
		end if;
		if ((f2."noOfFullEmp" != f1."noOfFullEmp" OR f1."noOfFullEmp" is NULL) AND f2."noOfFullEmp" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Number of employees changed ' , f1."noOfFullEmp", f2."noOfFullEmp" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
        if ((f2."companySize" != f1."companySize" OR f1."companySize" is NULL) AND f2."companySize" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Company size changed ',(CASE WHEN f1."companySize" is NULL THEN '0' ELSE f1."companySize" END), (CASE WHEN f2."companySize" is NULL THEN '0' ELSE f2."companySize" END) , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherFundingSource" != f1."otherFundingSource" OR f1."otherFundingSource" is NULL) AND f2."otherFundingSource" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate")  VALUES ('Funding Source changed ',(CASE WHEN ((f1."otherFundingSource" ='') OR (f1."otherFundingSource" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherFundingSource" END) ,(CASE WHEN ((f2."otherFundingSource" ='') OR (f2."otherFundingSource" is NULL) )THEN 'INITIALIZED_WITH_NULL' ELSE f2."otherFundingSource" END), to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
        if ((f2."industryname" != f1."industryname" OR f1."industryname" is NULL) AND f2."industryname" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Industry changed ' , f1."industryname" ::text , f2."industryname" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."modalityname" != f1."modalityname" OR f1."modalityname" is NULL) AND f2."funding" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Modality changed ', f1."modalityname" ::text , f2."modalityname" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."companyName" != f1."companyName" OR f1."companyName" is NULL) AND f2."companyName" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Company name changed ',  f1."companyName" , f2."companyName" , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."sitename" != f1."sitename" OR f1."sitename" is NULL) AND f2."sitename" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Site name changed ' , f1."sitename" ::text, f2."sitename" ::text, to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."bsourcesname" != f1."bsourcesname" OR f1."bsourcesname" is NULL) AND f2."bsourcesname" is NOT NULL) then
 			INSERT INTO biolabsfeed  ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Biolabs source changed ' ,f1."bsourcesname" ::text , f2."bsourcesname" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherBiolabsSources" != f1."otherBiolabsSources" OR f1."otherBiolabsSources" is NULL) AND f2."otherBiolabsSources" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Other Biolabs source changed ' , f1."otherBiolabsSources" ::text  , f2."otherBiolabsSources" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."techstagename" != f1."techstagename" OR f1."techstagename" is NULL) AND f2."techstagename" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate")  VALUES ('Stage of technology changed ' ,f1."techstagename" ::text ,f2."techstagename" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."technology" != f1."technology" OR f1."technology" is NULL) AND f2."technology" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Technology Summary changed ' , f1."technology" ::text ,  f2."technology" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."rAndDPath" != f1."rAndDPath" OR f1."rAndDPath" is NULL) AND f2."rAndDPath" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('R&D path & commercialization plan changed ' , f1."rAndDPath" ::text ,  f2."rAndDPath" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."foundedPlace" != f1."foundedPlace" OR f1."foundedPlace" is NULL) AND f2."foundedPlace" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Company founded place changed ' ,f1."foundedPlace" ::text , f2."foundedPlace" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherCompanyStage" != f1."otherCompanyStage" OR f1."otherCompanyStage" is NULL) AND f2."otherCompanyStage" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Stage of technology changed ',(CASE WHEN ((f1."otherCompanyStage" ='') OR (f1."otherCompanyStage" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherCompanyStage" END) ,(CASE WHEN ((f2."otherCompanyStage" ='') OR (f1."otherCompanyStage" is NULL) )THEN 'INITIALIZED_WITH_NULL' ELSE f2."otherCompanyStage" END), to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."intellectualProperty" != f1."intellectualProperty" OR f1."intellectualProperty" is NULL) AND f2."intellectualProperty" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Intellectual property related to your technology changed ' , f1."intellectualProperty" ::text ,  f2."intellectualProperty" ::text ,  to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherIntellectualProperty" != f1."otherIntellectualProperty" OR f1."otherIntellectualProperty" is NULL) AND f2."otherIntellectualProperty" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Intellectual property related to your technology changed  ',  (CASE WHEN ((f1."otherIntellectualProperty" ='') OR (f1."otherIntellectualProperty" is NULL) ) THEN 'INITIALIZED_WITH_NULL' ELSE f1."otherIntellectualProperty" END) ,(CASE WHEN ((f2."otherIntellectualProperty" ='') OR ((f2."otherIntellectualProperty" is NULL)) )THEN 'INITIALIZED_WITH_NULL' ELSE f2."otherIntellectualProperty" END), to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."isAffiliated" != f1."isAffiliated" OR f1."isAffiliated" is NULL) AND f2."isAffiliated" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Affiliated changed ' , (CASE WHEN f2."isAffiliated" = true THEN 'Yes' ELSE 'No' END) ,  to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."affiliatedInstitution" != f1."affiliatedInstitution" OR f1."affiliatedInstitution" is NULL) AND f2."affiliatedInstitution" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Affiliated Institution changed ' , f1."affiliatedInstitution" ::text , f2."affiliatedInstitution" ::text ,to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."elevatorPitch" != f1."elevatorPitch" OR f1."elevatorPitch" is NULL) AND f2."elevatorPitch" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Elevator Pitch changed ' , f1."elevatorPitch" ::text , f1."elevatorPitch" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."logoOnWall" != f1."logoOnWall" OR f1."logoOnWall" is NULL) AND f2."logoOnWall" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Logo changed ' , f1."logoOnWall" ::text ,f2."logoOnWall" , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."technologyPapersPublished" != f1."technologyPapersPublished" OR f1."technologyPapersPublished" is NULL) AND f2."technologyPapersPublished" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Published papers related to your technology changed ' , (CASE WHEN f1."technologyPapersPublished" = true THEN 'Yes' ELSE 'No' END), (CASE WHEN f2."technologyPapersPublished" = true THEN 'Yes' ELSE 'No' END) ,  to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."patentsFiledGranted" != f1."patentsFiledGranted" OR f1."patentsFiledGranted" is NULL) AND f2."patentsFiledGranted" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Patents filed & granted changed ' , f1."patentsFiledGranted" ::text , f2."patentsFiledGranted" ::text, to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."patentsFiledGrantedDetails" != f1."patentsFiledGrantedDetails" OR f1."patentsFiledGrantedDetails" is NULL) AND f2."patentsFiledGrantedDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Patents filed & granted changed ' , f1."patentsFiledGrantedDetails" ::text ,f2."patentsFiledGranted" ::text,  to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."academiaPartnerships" != f1."academiaPartnerships" OR f1."academiaPartnerships" is NULL) AND f2."academiaPartnerships" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Recognized partnerships with academia changed ' ,(CASE WHEN f1."academiaPartnerships" = true THEN 'Yes' ELSE 'No' END) , (CASE WHEN f2."academiaPartnerships" = true THEN 'Yes' ELSE 'No' END) ,  to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."academiaPartnershipDetails" != f1."academiaPartnershipDetails" OR f1."academiaPartnershipDetails" is NULL) AND f2."academiaPartnershipDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Description for recognized partnerships with academia changed ' , f1."academiaPartnershipDetails" ::text , f2."academiaPartnershipDetails" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."industryPartnerships" != f1."industryPartnerships" OR f1."industryPartnerships" is NULL) AND f2."industryPartnerships" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Recognized partnerships with industry changed ' , (CASE WHEN f1."industryPartnerships" = true THEN 'Yes' ELSE 'No' END) ,  to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."industryPartnershipsDetails" != f1."industryPartnershipsDetails" OR f1."industryPartnershipsDetails" is NULL) AND f2."industryPartnershipsDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed ("feedmsg", "beforevalue","aftervalue","cdate") VALUES ('Description for recognized partnerships with industry changed ' , f1."industryPartnershipsDetails" ::text , f2."industryPartnershipsDetails" ::text , to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		
        f2 := f1;
           end loop;
		  
	return query select * from biolabsfeed;
end;
 
$BODY$;
