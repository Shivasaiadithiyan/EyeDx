import 'package:flutter/material.dart';
import 'package:oct_system/services/api_service.dart';
import 'quickscan_detail_page.dart';
import 'quickscan_upload_page.dart';

class QuickScanPage extends StatefulWidget {
  @override
  _QuickScanPageState createState() => _QuickScanPageState();
}

class _QuickScanPageState extends State<QuickScanPage> {
  List<dynamic> quickscans = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    _loadQuickScans();
  }

  void _loadQuickScans() async {
    try {
      var result = await ApiService.getQuickScans();
      setState(() {
        quickscans = result ?? [];
        loading = false;
      });
    } catch (e) {
      print("Error: $e");
      setState(() {
        quickscans = [];
        loading = false;
      });
    }
  }

  void _refreshPage() {
    setState(() {
      loading = true;
    });
    _loadQuickScans();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Quick Scans"),
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
        itemCount: quickscans.length,
        itemBuilder: (_, index) {
          final scan = quickscans[index];
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: ListTile(
              leading: Icon(Icons.image),
              title: Text("QuickScan ID: ${scan.id}"),
              subtitle: Text(scan.classification ?? 'Classifying...'),
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => QuickScanDetailPage(scanId: scan.id),
                  ),
                );
              },
            ),
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () async {
          final uploaded = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => QuickScanUploadPage()),
          );
          if (uploaded == true) _refreshPage();
        },
      ),
    );
  }
}
