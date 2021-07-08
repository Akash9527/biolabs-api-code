
-- USE below command to run the function
-- SELECT feeds(9);

-- USE below command to check temp table anddrop
-- select * from biolabsfeed
-- drop table if exists biolabsfeed;

-- USE below command drop the function
-- DROP FUNCTION feeds

create or replace FUNCTION feeds(compId integer) 
RETURNS TABLE (feeds varchar(500)) AS $$

declare
    f1 record;
    f2 record;
begin
  drop table if exists biolabsfeed;
  CREATE TEMP table biolabsfeed (feedmsg varchar(500));

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
 			INSERT INTO biolabsfeed VALUES ('Funding changed to ' || f2."funding" || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
		end if;
-- 		if ((f2."fundingSource" != f1."fundingSource" OR f1."fundingSource" is NULL) AND f2."funding" is NOT NULL) then
-- 			INSERT INTO biolabsfeed VALUES ('Funding Source changed to ' || f2."fundingSource" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
-- 		end if;
		if ((f2."fundingsrcname" != f1."fundingsrcname" OR f1."fundingsrcname" is NULL) AND f2."funding" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Funding Source changed to ' || f2."fundingsrcname" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
		end if;
		if ((f2."noOfFullEmp" != f1."noOfFullEmp" OR f1."noOfFullEmp" is NULL) AND f2."noOfFullEmp" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Number of employees changed to ' || f2."noOfFullEmp" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
        if ((f2."companySize" != f1."companySize" OR f1."companySize" is NULL) AND f2."companySize" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Company size changed to ' || f2."companySize" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherFundingSource" != f1."otherFundingSource" OR f1."otherFundingSource" is NULL) AND f2."otherFundingSource" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Funding Source changed to other on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
        if ((f2."industryname" != f1."industryname" OR f1."industryname" is NULL) AND f2."industryname" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Industry changed to ' || f2."industryname" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."modalityname" != f1."modalityname" OR f1."modalityname" is NULL) AND f2."funding" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Modality changed to ' || f2."modalityname" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."companyName" != f1."companyName" OR f1."companyName" is NULL) AND f2."companyName" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Company name changed to ' || f2."companyName" || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."sitename" != f1."sitename" OR f1."sitename" is NULL) AND f2."sitename" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Site name changed to ' || f2."sitename" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."bsourcesname" != f1."bsourcesname" OR f1."bsourcesname" is NULL) AND f2."bsourcesname" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Biolabs source changed to ' || f2."bsourcesname" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherBiolabsSources" != f1."otherBiolabsSources" OR f1."otherBiolabsSources" is NULL) AND f2."otherBiolabsSources" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Other Biolabs source changed to ' || f2."otherBiolabsSources" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."techstagename" != f1."techstagename" OR f1."techstagename" is NULL) AND f2."techstagename" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Stage of technology changed to ' || f2."techstagename" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."technology" != f1."technology" OR f1."technology" is NULL) AND f2."technology" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Technology Summary changed to ' || f2."technology" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."rAndDPath" != f1."rAndDPath" OR f1."rAndDPath" is NULL) AND f2."rAndDPath" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('R&D path & commercialization plan changed to ' || f2."rAndDPath" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."foundedPlace" != f1."foundedPlace" OR f1."foundedPlace" is NULL) AND f2."foundedPlace" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Company founded place changed to ' || f2."foundedPlace" ::text || ' on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherCompanyStage" != f1."otherCompanyStage" OR f1."otherCompanyStage" is NULL) AND f2."otherCompanyStage" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Stage of technology changed to other on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."intellectualProperty" != f1."intellectualProperty" OR f1."intellectualProperty" is NULL) AND f2."intellectualProperty" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Intellectual property related to your technology changed to ' || f2."intellectualProperty" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."otherIntellectualProperty" != f1."otherIntellectualProperty" OR f1."otherIntellectualProperty" is NULL) AND f2."otherIntellectualProperty" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Intellectual property related to your technology changed to other on ' || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."isAffiliated" != f1."isAffiliated" OR f1."isAffiliated" is NULL) AND f2."isAffiliated" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Affiliated changed to ' || f2."isAffiliated" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."affiliatedInstitution" != f1."affiliatedInstitution" OR f1."affiliatedInstitution" is NULL) AND f2."affiliatedInstitution" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Affiliated Institution changed to ' || f2."affiliatedInstitution" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."elevatorPitch" != f1."elevatorPitch" OR f1."elevatorPitch" is NULL) AND f2."elevatorPitch" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Elevator Pitch changed to ' || f2."elevatorPitch" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."logoOnWall" != f1."logoOnWall" OR f1."logoOnWall" is NULL) AND f2."logoOnWall" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Logo changed to ' || f2."logoOnWall" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."technologyPapersPublished" != f1."technologyPapersPublished" OR f1."technologyPapersPublished" is NULL) AND f2."technologyPapersPublished" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Published papers related to your technology changed to ' || f2."technologyPapersPublished" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."patentsFiledGranted" != f1."patentsFiledGranted" OR f1."patentsFiledGranted" is NULL) AND f2."patentsFiledGranted" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Patents filed & granted changed to ' || f2."patentsFiledGranted" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."academiaPartnerships" != f1."academiaPartnerships" OR f1."academiaPartnerships" is NULL) AND f2."academiaPartnerships" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Recognized partnerships with academia changed to ' || f2."academiaPartnerships" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."academiaPartnershipDetails" != f1."academiaPartnershipDetails" OR f1."academiaPartnershipDetails" is NULL) AND f2."academiaPartnershipDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Description for recognized partnerships with academia changed to ' || f2."academiaPartnershipDetails" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."industryPartnerships" != f1."industryPartnerships" OR f1."industryPartnerships" is NULL) AND f2."industryPartnerships" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Recognized partnerships with industry changed to ' || f2."industryPartnerships" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		if ((f2."industryPartnershipsDetails" != f1."industryPartnershipsDetails" OR f1."industryPartnershipsDetails" is NULL) AND f2."industryPartnershipsDetails" is NOT NULL) then
 			INSERT INTO biolabsfeed VALUES ('Description for recognized partnerships with industry changed to ' || f2."industryPartnershipsDetails" ::text || to_char(f2."cdate", 'MM/dd/yyyy'));
        end if;
		
        f2 := f1;
    end loop;
	return query select * from biolabsfeed;
end;
$$ LANGUAGE plpgsql;
