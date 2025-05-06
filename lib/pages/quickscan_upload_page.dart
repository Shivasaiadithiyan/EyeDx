import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:oct_system/services/api_service.dart';

class QuickScanUploadPage extends StatefulWidget {
  @override
  _QuickScanUploadPageState createState() => _QuickScanUploadPageState();
}

class _QuickScanUploadPageState extends State<QuickScanUploadPage> {
  File? _image;
  bool uploading = false;

  Future<void> _pickImage() async {
    final picked = await ImagePicker().pickImage(source: ImageSource.gallery);
    if (picked != null) {
      setState(() {
        _image = File(picked.path);
      });
    }
  }

  Future<void> _upload() async {
    if (_image == null) return;

    setState(() {
      uploading = true;
    });

    try {
      // Upload the image to Imgur and get the image URL
      final imgUrl = await ApiService.uploadToImgur(_image!);
      if (imgUrl != null) {
        // Upload the quick scan with the image URL
        await ApiService.uploadQuickScan(imgUrl);
        Navigator.pop(context, true); // Trigger refresh
      }
    } catch (e) {
      // Handle error (optional: show a toast or dialog with error message)
      print('Error uploading image: $e');
    }

    setState(() {
      uploading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("Upload QuickScan")),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            _image != null
                ? Image.file(_image!, height: 200)
                : Placeholder(fallbackHeight: 200),
            SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: _pickImage,
              icon: Icon(Icons.photo),
              label: Text("Choose Image"),
            ),
            SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: uploading ? null : _upload,
              icon: uploading ? CircularProgressIndicator() : Icon(Icons.cloud_upload),
              label: Text("Upload"),
            ),
          ],
        ),
      ),
    );
  }
}
