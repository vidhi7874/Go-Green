const approvalCycleStatus = Object.freeze({
  l4_rejected: 10,
  l4_approved: 9,
  l4_assigned: 8,
  l3_rejected: 7,
  l3_approved: 6,
  l3_assigned: 5,
  l2_rejected: 4,
  l2_approved: 3,
  l2_assigned: 2,
  l1_submitted: 1,
  l1_draft: 0,
});

const checkApprovalCycleStatus = (status, ...statuses) =>
  statuses.includes(Number(status));

export { approvalCycleStatus, checkApprovalCycleStatus };
