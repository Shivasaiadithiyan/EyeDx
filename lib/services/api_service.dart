// lib/services/api_service.dart

import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:oct_system/utils/auth.dart';
import 'package:oct_system/models/scan_model.dart';
import 'package:oct_system/models/quickscan_model.dart';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
//10.0.2.2
//192.168.137.1
const baseUrl = 'http://192.168.137.1:5000/api';
const imgurClientId = 'e597cff7a163459';

class ApiService {
  static Future<String?> login(String loginKey, String password) async {
    final res = await http.post(Uri.parse('$baseUrl/patient/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'loginKey': loginKey, 'password': password}));

    if (res.statusCode == 200) {
      final data = jsonDecode(res.body);
      await Auth.saveToken(data['token']);
      return null;
    } else {
      return 'Login failed';
    }
  }

  static Future<String?> signup(String email, String password) async {
    final res = await http.post(Uri.parse('$baseUrl/patient/signup'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}));

    return res.statusCode == 201 ? null : 'Signup failed';
  }

  static Future<List<ScanModel>> getDoctorScans() async {
    final token = await Auth.getToken();
    final res = await http.get(Uri.parse('$baseUrl/patient/scans'),
        headers: {'Authorization': 'Bearer $token'});

    if (res.statusCode == 200) {
      final List<dynamic> data = jsonDecode(res.body);
      return data.map((e) => ScanModel.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load doctor scans');
    }
  }

  static Future<ScanModel> getScanById(int id) async {
    final token = await Auth.getToken();
    final res = await http.get(Uri.parse('$baseUrl/patient/scan/$id'),
        headers: {'Authorization': 'Bearer $token'});

    if (res.statusCode == 200) {
      return ScanModel.fromJson(jsonDecode(res.body));
    } else {
      throw Exception('Failed to load scan');
    }
  }

  static Future<List<QuickScanModel>> getQuickScans() async {
    final token = await Auth.getToken();
    final res = await http.get(
      Uri.parse('$baseUrl/patient/quickscans'),
      headers: {'Authorization': 'Bearer $token'},
    );

    if (res.statusCode == 200) {
      final Map<String, dynamic> body = jsonDecode(res.body);
      final List<dynamic> data = body['quickscans'];  // ✅ extract the list correctly
      return data.map((e) => QuickScanModel.fromJson(e)).toList();
    } else {
      throw Exception('Failed to load quick scans');
    }
  }

  static Future<void> uploadQuickScan(String imgurl) async {
    final token = await Auth.getToken();
    final res = await http.post(Uri.parse('$baseUrl/patient/quickscan'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode({'imgurl': imgurl}));

    if (res.statusCode != 201) {
      throw Exception('Failed to upload quick scan');
    }
  }

  static Future<QuickScanModel> getQuickScanById(int id) async {
    final token = await Auth.getToken();
    final res = await http.get(Uri.parse('$baseUrl/patient/quickscan/$id'),
        headers: {'Authorization': 'Bearer $token'});

    if (res.statusCode == 200) {
      return QuickScanModel.fromJson(jsonDecode(res.body));
    } else {
      throw Exception('Failed to load quick scan');
    }
  }

  static Future<String?> uploadToImgur(File image) async {
    final url = Uri.parse('https://api.imgur.com/3/upload');
    final request = http.MultipartRequest('POST', url)
      ..headers['Authorization'] = 'Client-ID $imgurClientId'
      ..files.add(await http.MultipartFile.fromPath('image', image.path));

    final response = await request.send();

    if (response.statusCode == 200) {
      final responseBody = await response.stream.bytesToString();
      final data = jsonDecode(responseBody);
      return data['data']['link']; // Returns the image URL
    } else {
      throw Exception('Failed to upload image to Imgur');
    }
  }
}
