import 'package:shared_preferences/shared_preferences.dart';
import 'package:oct_system/pages/dashboard_page.dart';
import 'package:flutter/material.dart';

import '../pages/login_page.dart';

class Auth {
  static Future<void> saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', token);
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  static Future<bool> isLoggedIn() async {
    return (await getToken()) != null;
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
  }

  static Widget get dashboard => DashboardPage();
}
