from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app) 

DATABASE = 'database.db'

def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS reports (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type INTEGER NOT NULL,
            photo_url TEXT NOT NULL,
            description TEXT,
            phone_number TEXT NOT NULL,
            lat REAL NOT NULL,
            long REAL NOT NULL,
            address TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            status INTEGER DEFAULT 0,
            date_posted TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def format_report(row):
    """Convert database row to frontend-friendly format with nested last_seen"""
    return {
        "id": row['id'],
        "name": row['name'],
        "type": row['type'],
        "photo_url": row['photo_url'],
        "description": row['description'],
        "phone_number": row['phone_number'],
        "last_seen": {
            "lat": row['lat'],
            "long": row['long']
        },
        "address": row['address'],
        "status": row['status'],
        "date_posted": row['date_posted']
    }

@app.route('/api/reports', methods=['GET'])
def get_reports():
    conn = get_db()
    reports = conn.execute('SELECT * FROM reports ORDER BY date_posted DESC').fetchall()  
    conn.close()
    return jsonify([format_report(row) for row in reports])

@app.route('/api/reports', methods=['POST'])
def create_report():
    data = request.json
    
    password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
    
    report_id = str(uuid.uuid4())
    conn = get_db()
    conn.execute('''
        INSERT INTO reports (id, name, type, photo_url, description, phone_number, 
                            lat, long, address, password_hash, status, date_posted)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        report_id,
        data['name'],
        data['type'],
        data['photo_url'],
        data['description'],
        data['phone_number'],
        data['last_seen']['lat'],
        data['last_seen']['long'],
        data['address'],
        password_hash,
        0,  # status 0 = Lost
        datetime.now().strftime('%Y-%m-%d')
    ))
    conn.commit()
    conn.close()
    
    return jsonify({'id': report_id}), 201

@app.route('/api/reports/<report_id>/resolve', methods=['PUT'])
def resolve_report(report_id):
    data = request.json
    password_input = data['password']
    
    conn = get_db()
    report = conn.execute('SELECT password_hash FROM reports WHERE id = ?', (report_id,)).fetchone()
    
    if not report:
        return jsonify({'error': 'Report not found'}), 404
    
    input_hash = hashlib.sha256(password_input.encode()).hexdigest()
    
    if input_hash != report['password_hash']:
        return jsonify({'error': 'Incorrect password'}), 401
    
    # Update status to Found (1)
    conn.execute('UPDATE reports SET status = 1 WHERE id = ?', (report_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Report marked as found'}), 200

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5173)