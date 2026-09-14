import math
from datetime import datetime

class TrustEngine:
    def __init__(self):
        self.incidents_cache = []

    def calculate_distance_km(self, lat1, lon1, lat2, lon2):
        R = 6371  # Earth radius in kilometers
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon1 - lon2)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def evaluate_complaint(self, payload, client_ip):
        trust_value = 100
        flags = []
        
       # 1. GPS VS CLAIMED LOCATION VERIFICATION
        telemetry = payload.get("telemetry") or {}
        device_gps = telemetry.get("gps")
        claimed_location = payload.get("claimedLocation") or {}
        
        if device_gps and "latitude" in device_gps and "longitude" in device_gps:
            dev_lat = device_gps["latitude"]
            dev_lon = device_gps["longitude"]
            target_lat = claimed_location.get("latitude", dev_lat)
            target_lon = claimed_location.get("longitude", dev_lon)
            
            distance = self.calculate_distance_km(dev_lat, dev_lon, target_lat, target_lon)
            if distance > 2.0: # More than 2 km discrepancy
                trust_value -= 30
                flags.append("LOCATION_MISMATCH_GPS_VS_CLAIMED_AREA")
        else:
            trust_value -= 25
            flags.append("GPS_DATA_MISSING_OR_INVALID")

        # 2. TERRORIST ATTACK & TEMPORAL CLUSTERING CHECK
        is_terror_alert = any(kw in payload.get("text", "").lower() for kw in ["terror", "gun", "shoot", "bomb", "attack"])
        current_time = datetime.now().timestamp()
        
        # Filter cache to last 5 minutes
        self.incidents_cache = [inc for inc in self.incidents_cache if (current_time - inc["timestamp"]) < 300]
        
        # Check source and exact time matching
        same_time_reports = [
            inc for inc in self.incidents_cache 
            if abs(inc["timestamp"] - current_time) < 0.5 and inc["ip"] == client_ip
        ]
        
        if len(same_time_reports) >= 2:
            trust_value = 10
            flags.append("SYNCHRONIZED_BOT_SPAM_EXACT_TIME")
        
        if is_terror_alert:
            same_location_witnesses = [
                inc for inc in self.incidents_cache 
                if inc["is_terror"] and abs(inc["timestamp"] - current_time) < 60
            ]
            if len(same_location_witnesses) >= 2:
                trust_value = 95
                flags.append("MULTI_WITNESS_CORROBORATED_TERROR_EVENT")
            else:
                trust_value -= 15
                flags.append("ISOLATED_UNVERIFIED_TERROR_CLAIM")

        # Log current incident to cache
        self.incidents_cache.append({
            "ip": client_ip,
            "timestamp": current_time,
            "is_terror": is_terror_alert,
            "text": payload.get("text")
        })

        return {
            "trustValue": max(trust_value, 0),
            "flags": flags,
            "isVerified": trust_value >= 60
        }