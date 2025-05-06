import 'package:flutter/material.dart';
import 'package:oct_system/services/api_service.dart';
import 'doctorscan_detail_page.dart';

class DoctorScanPage extends StatefulWidget {
  @override
  _DoctorScanPageState createState() => _DoctorScanPageState();
}

class _DoctorScanPageState extends State<DoctorScanPage> {
  List<dynamic> scans = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadScans();
  }

  void _loadScans() async {
    var result = await ApiService.getDoctorScans();
    setState(() {
      scans = result ?? [];
      loading = false;
    });
  }

  void _refreshPage() {
    setState(() {
      loading = true;
    });
    _loadScans();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Doctor Scans"),
        actions: [
          IconButton(
            icon: Icon(Icons.refresh),
            onPressed: _refreshPage,
          ),
        ],
      ),
      body: loading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: scans.length,
        itemBuilder: (_, index) {
          final scan = scans[index];
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: Icon(Icons.image),
              title: Text("Scan ID: ${scan.id}"),
              subtitle: Text(scan.classification ?? 'Pending'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => DoctorScanDetailPage(scanId: scan.id),
                  ),
                );
              },
            ),
          );
        },
      ),
    );
  }
}
