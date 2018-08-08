// SignUp and Amazon Setup
export const user_create_api_url = 'User/Register';
export const amazon_ValidateSetupAccount='Amazon/validateAccount';
// End Here

// AdsReporting
export const adsReport_search_filter_result_api_url = 'AdsReport/searchbyfilter';
// End Here

// Setting -> ChangePasword
export const user_password_setting_api_url = 'User/updateusersetting';
// End Here

export const user_password_forgot_api_url = 'User/mailpassword';
export const user_email_check_api_url = 'User/checkmail';
export const dashboard_all_users_api_url = 'Dashboard/users';
export const users_update_api_url = 'User/updateuserinfo';
export const user_delete_api_url = 'User/deleteUser';
export const import_filter_add_api_url = 'Import/addFilter';
export const inventory_search_filter_result_api_url = 'Inventory/searchbyfilter';

// Maintenance
export const inventory_import_not_amazon_api_url = 'Inventory/ImportNotAmazon';
export const inventory_amazon_not_import_api_url = 'Inventory/AmazonNotImport';
// End Here

// Setting -> Inventory setting
export const inventory_setting_api_url = 'Inventory/inventorysetting';
export const inventory_setting_detail_api_url = 'Inventory/inventorysettingdetail';
// End Here

// Profit Report
export const profit_search_filter_report='profit/profitsearchfilter';
export const profit_download_report='Profit/downloadprofitReport';
export const child_Sku_List_By_Loginuser_Or_ParentSku = 'Report/GetChildSku';
export const profit_Loss_Estimated='Profit/profitestimate';
export const profit_Loss_Estimate_Download='Profit/downloadProfitLossEstimate';
// End Here

// Log comment--> Link
export const log_add_comment_api_url = 'Log/addlogcomment';
export const log_comment_list_api_url = 'Log/commentlist';
export const log_parent_list_api_url = 'Log/parentlist';
export const log_childbyparent_list_api_url = 'Log/parentchild';
export const log_delete_api_url = 'Log/logdelete';// for deleting log Comment
export const upload_log_image='Log/UploadLogImage';
// End Here

// Inventory-> Link
export const parent_import_list_api_url = 'Parent/importlist';
export const parent_upload_Parent_Child_excel_api_url = 'Parent/UploadParentOrChildExcel';
export const parent_child_list_by_id_api_url = 'Parent/Childbyparent';
export const delete_parent_Child='Parent/DeleteChildOrParent';
export const inventory_sales_report_filter_url='Report/InventorySearchFilter';
// End Here

// Report ->Link
export const searchparent_Sku_List = 'Report/GetParentSku';
export const get_All_User_list = 'User/getAlluser';
// End here


// Setting -> Report Scheduling
export const get_All_ReportSeetings='Parent/GetAllReportSetting';
export const add_Or_Update_ReportSetting='Parent/ReportSchedular';
export const get_Categoris ='Report/getCategory';
export const update_ReportType='Parent/UpdateReportByMerchantMarketPlace';
// End Here

// Setting -> marketplace
export const get_All_region= 'Amazon/getAllRegion';
export const get_MarketPlaces ='Amazon/getAllMarketplace';
export const add_Update_Merchant='Amazon/addUpdateMarketPlace';
export const get_markteplace_By_merchantId='Amazon/getMarketPlaceByMerchant';
export const update_Default_Marketplace='Amazon/updateDefaultMercahntId';
// End Here
// Setting -> accountSetting
export const get_Merchant='Amazon/getMerchant';
export const get_All_Merchant='Amazon/getActivatedMerchant';
export const update_merchant='Amazon/updateMerchant';
// End here

// Settting ->AdvertisementSetting
export const get_Merchant_For_Adv='AdsReport/getMerchantForAdv';
export const get_AmazonData='AdsReport/getAmazonData';
export const reset_Advertisement='AdsReport/resetAdv';
// End here

// DSTBCI Link
export const upload_DSTBCI_Report='Dstbci/UploadDSTBCI';
export const Get_Last_Upload_File_Date='Dstbci/getlastfileuploaddate';
// End Here

// SignUP Link
export const Get_All_Country='Account/allCountry';
export const register_User='Account/userSignup';
// End Here

// All UserList by ParentId
export const all_User_By_parentId='User/alluserList';
// End here

// Sample File Download link
export const parent_Sameple_Download='Content/Sampledownload/SampleFile_ParentUpload.xlsx';
export const child_Sameple_Download='Content/Sampledownload/SampleFile_ChildUpload.xlsx';
// End here
