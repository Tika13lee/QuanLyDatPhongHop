package vn.com.kltn_project_v1.services;

public interface IAccount {
    public String login(String userName, String password);
    public String changePassword(String userName, String oldPassword, String newPassword);
}
