using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DataAccessLayer;
using BusinessAccessLayer;
using System.Data.SqlClient;
using System.Data;
using System.Text;

/// <summary>
/// Summary description for Logins
/// </summary>
public class Logins : BAL
{
    public string UserID { get; set; }
    public string Pass { get; set; }
    DataTable dt;
    public Logins()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public DataTable getLoginDetails(string Username, string Password)
    {
        this.command = new SqlCommand();
        this.command.CommandType = CommandType.Text;
        this.command.CommandText = "select * from Logins where Username=@Username and Password=@Password";
        this.command.Parameters.AddWithValue("@Username", Username);
        this.command.Parameters.AddWithValue("@Password", Password);
        return this.datatable = ExecuteDataSet(this.command, "Logins");
    }
    public void updateLogins(string AutoID, string NewPass)
    {
        this.command = new SqlCommand();
        this.command.CommandType = CommandType.Text;
        this.command.CommandText = "update Logins set Password='" + NewPass + "' where AutoID='" + AutoID + "'";
        ExecuteNonQuery(this.command);
    }
    public Int64 checkOldPass(string OldPass , string Username)
    {
        this.command = new SqlCommand();
        this.command.CommandType = CommandType.Text ;
        this.command.CommandText = "select count(*) from Logins where Password=@OldPass and Username=@UserName";
        this.command.Parameters.AddWithValue("@OldPass", OldPass);
        this.command.Parameters.AddWithValue("@UserName", Username);
        return intExecuteScaler(this.command);
    }
    public void Insert_Login_Log(string OiralID, string AccountType, string FromName, string FromID, string status)
    {
        Class_Global gob = new Class_Global();
        string IP = gob.IPAddress();
        Int64 AutoID = gob.GetAutoID("tbl_Logins_Log", "AutoID", 10001);
        this.command = new SqlCommand();
        this.command.CommandType = CommandType.StoredProcedure;
        this.command.CommandText = "sp_Login_Log";
        this.command.Parameters.AddWithValue("@AutoID", AutoID);
        this.command.Parameters.AddWithValue("@OiralID", OiralID);
        this.command.Parameters.AddWithValue("@AccountType", AccountType);
        this.command.Parameters.AddWithValue("@FromName", FromName);
        this.command.Parameters.AddWithValue("@FromID", FromID);
        this.command.Parameters.AddWithValue("@IP", IP);
        this.command.Parameters.AddWithValue("@Date", DateTime.UtcNow.ToString());
        this.command.Parameters.AddWithValue("@Status", status);
        ExecuteNonQuery(this.command);
    }
}