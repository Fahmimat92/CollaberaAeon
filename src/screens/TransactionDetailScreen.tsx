import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  formatCurrency,
  formatDate,
  formatTime,
} from "../utils/dateFormatter";

export default function TransactionDetailScreen({ route, navigation }: any) {
  const { transaction } = route.params;
  const insets = useSafeAreaInsets();
  const isCredit = transaction.amount > 0;

  return (
    <View style={styles.masterContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#B72773" />
      
      <View style={[styles.brandHeaderBanner, { paddingTop: Math.max(insets.top, 70) }]}>
          <Text style={styles.bannerMainTitle}>Transaction Detail</Text>
        <Text style={styles.bannerSubtitle}>AEON Bank Secure Payment</Text>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.scrollLayoutContent, 
          { paddingBottom: Math.max(insets.bottom, 24) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.receiptCard}>
          
          <View style={styles.statusBadgeRow}>
            <View style={[
              styles.statusLabelBadge,
              { backgroundColor: isCredit ? "#E8F5E9" : "#F3F4F6" }
            ]}>
              <Text style={[styles.statusBadgeText, { color: isCredit ? "#16A34A" : "#4B5563" }]}>
                {isCredit ? "📥 Funds Received" : "📤 Successful Transfer"}
              </Text>
            </View>
          </View>

          <View style={styles.amountShowcaseBlock}>
            <Text style={styles.amountLabelText}>Transaction Amount</Text>
            <Text style={[
              styles.amountValueText,
              { color: isCredit ? "#16A34A" : "#d42f2f" }
            ]}>
              {isCredit ? "+" : ""}{formatCurrency(transaction.amount)}
            </Text>
          </View>

          <View style={styles.receiptDividerLine} />

          <View style={styles.metadataFieldsBlock}>
            
            <View style={styles.detailDataRow}>
              <Text style={styles.rowFieldLabel}>Recipient Name</Text>
              <Text style={styles.rowFieldValue}>{transaction.recipientName}</Text>
            </View>

            <View style={styles.detailDataRow}>
              <Text style={styles.rowFieldLabel}>Transfer Description</Text>
              <Text style={styles.rowFieldValue}>{transaction.transferName}</Text>
            </View>

            <View style={styles.detailDataRow}>
              <Text style={styles.rowFieldLabel}>Reference ID</Text>
              <Text style={[styles.rowFieldValue, styles.monoRefText]}>
                {transaction.refId}
              </Text>
            </View>

            <View style={styles.detailDataRow}>
              <Text style={styles.rowFieldLabel}>Transaction Date</Text>
              <Text style={styles.rowFieldValue}>
                {formatDate(transaction.transferDate)}
              </Text>
            </View>

            <View style={styles.detailDataRow}>
              <Text style={styles.rowFieldLabel}>Transaction Time</Text>
              <Text style={styles.rowFieldValue}>
                {formatTime(transaction.transferDate)}
              </Text>
            </View>

          </View>

          <View style={styles.securityStampWrapper}>
            <Text style={styles.securityStampText}>🛡️ Digital Receipt Generated Securely</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.shareReceiptButton} 
          activeOpacity={0.8}
          onPress={navigation.goBack}
        >
          <Text style={styles.shareReceiptButtonText}>Return</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: "#F9FAFC",
  },
  brandHeaderBanner: {
    backgroundColor: "#B72773",
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: "center",
  },
  bannerMainTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  bannerSubtitle: {
    color: "#FCE7F3",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    opacity: 0.9,
  },
  scrollLayoutContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  receiptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#2C313B",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  statusBadgeRow: {
    alignItems: "center",
    marginBottom: 16,
  },
  statusLabelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  amountShowcaseBlock: {
    alignItems: "center",
    paddingVertical: 8,
  },
  amountLabelText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountValueText: {
    fontSize: 28,
    fontWeight: "800",
    marginTop: 6,
    letterSpacing: -0.5,
  },
  receiptDividerLine: {
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 1,
    marginVertical: 20,
    width: "100%",
  },
  metadataFieldsBlock: {
    width: "100%",
  },
  detailDataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  rowFieldLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    flex: 1,
    paddingRight: 16,
  },
  rowFieldValue: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
    textAlign: "right",
    flex: 2,
  },
  monoRefText: {
    fontFamily: Platform.OS === "ios" ? "CourierNewPS-BoldMT" : "monospace",
    letterSpacing: 0.2,
    color: "#374151",
  },
  securityStampWrapper: {
    alignItems: "center",
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
  },
  securityStampText: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  shareReceiptButton: {
    backgroundColor: "#B72773",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#B72773",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  shareReceiptButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});