-- FUNCTION: public.calculate_prorating(numeric, integer, timestamp with time zone, timestamp with time zone, integer, boolean, integer)

-- DROP FUNCTION public.calculate_prorating(numeric, integer, timestamp with time zone, timestamp with time zone, integer, boolean, integer);

CREATE OR REPLACE FUNCTION public.calculate_prorating(
	item_cost numeric,
	selected_month integer,
	start_date timestamp with time zone,
	end_date timestamp with time zone,
	item_quantity integer,
	currentcharge boolean,
	select_year integer)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare
    calculated_startDate date;
    calculated_endDate date;
	No_Of_Days_Month integer;
	No_Of_Days_calculate integer;
	return_value integer;
begin
	if (start_Date is null) then
		calculated_startDate =  TO_DATE(select_year ::text || '-' || selected_month ::text || '-' || '01','YYYY-MM-DD');
	end if;
	
	if (start_Date is not null) then
		calculated_startDate =  start_Date;
	end if;
	raise notice '1. calculated_startDate %',calculated_startDate;
	if (end_Date is null) then
		calculated_endDate =  date (select_year ::text || '-' || selected_month ::text || '-' || '01') + interval '1 month -1 day';
	end if;
	if (end_Date is not null) then
		calculated_endDate =  end_Date;
	end if;
	raise notice '2. calculated_EndDate %',calculated_endDate;
	
	No_Of_Days_calculate = calculated_endDate - calculated_startDate + 1;
	
	raise notice '3. No_Of_Days_calculate %',No_Of_Days_calculate;
	
	No_Of_Days_Month = DATE_PART('days',DATE_TRUNC('month',calculated_startDate) + '1 MONTH'::INTERVAL - '1 DAY'::INTERVAL);
	
	raise notice '4. No_Of_Days_Month %',No_Of_Days_Month;
								 
	if(currentCharge is false) then
		return_value = 0;
	end if;
	if(currentCharge is true) then 
		return_value = (item_cost / No_Of_Days_Month) * item_quantity * No_Of_Days_calculate;
	end if;
	return return_value;
end;
$BODY$;