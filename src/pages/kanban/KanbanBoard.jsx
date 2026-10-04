import React, { useState, useEffect } from "react";
import { Kanban as KanbanIcon, Plus, GripVertical } from 'lucide-react';
import CreateIssueModal from '../../components/modal/CreateIssueModal';
import IssueDetailsModal from '../../components/issue/IssueDetailsModal';
const emptyBoardTemplate = [
  { id: 'todo', title: 'TO DO', status: 'TO DO', cards: [] },
  { id: 'in-progress', title: 'IN PROGRESS', status: 'IN PROGRESS', cards: [] },
  { id: 'review', title: 'IN REVIEW', status: 'IN REVIEW', cards: [] },
  { id: 'done', title: 'DONE', status: 'DONE', cards: [] }
];

const KanbanBoard = ({ boardData = null, onIssueSync = null }) => {
  const [columns, setColumns] = useState(boardData || emptyBoardTemplate);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [draggedCard, setDraggedCard] = useState(null);
  const [dragOverCol, setDragOverCol] = useState(null);
  useEffect(() => {
    if (boardData) {
      setColumns(boardData);
    }
  }, [boardData]);

  const handleDragStart = (e, card) => {
    setDraggedCard(card);
    e.dataTransfer.setData('text/plain', card.key);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (colId) => {
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    setDragOverCol(null);
    if (!draggedCard) return;

    const targetCol = columns.find((c) => c.id === targetColId);
    if (!targetCol) return;

    const targetStatus = targetCol.status;
    if (draggedCard.status === targetStatus) {
      setDraggedCard(null);
      return;
    }

    const updatedCard = { ...draggedCard, status: targetStatus };
    setColumns((prevCols) =>
      prevCols.map((col) => {
        if (col.status === draggedCard.status) {
          return { ...col, cards: col.cards.filter((c) => c.key !== draggedCard.key) };
        }
        if (col.id === targetColId) {
          return { ...col, cards: [updatedCard, ...col.cards] };
        }
        return col;
      })
    );

    setDraggedCard(null);
    if (onIssueSync) onIssueSync(updatedCard);
  };

  const handleCreateIssue = (newIssueData) => {
    const newCard = {
      key: `FLW-${Date.now().toString().slice(-4)}`,
      title: newIssueData.title,
      priority: newIssueData.priority || 'Medium',
      points: Number(newIssueData.storyPoints) || 3,
      status: 'TO DO',
      description: newIssueData.description || '',
      issueType: newIssueData.issueType || 'Task',
    };

    setColumns((prevCols) =>
      prevCols.map((col) =>
        col.id === 'todo' ? { ...col, cards: [newCard, ...col.cards] } : col
      )
    );

    if (onIssueSync) onIssueSync(newCard, 'CREATE');
  };

  const handleStatusChange = (issueKey, newStatus) => {
    let movedCard = null;

    // 1. Remove card from its current location
    const columnsWithoutCard = columns.map((col) => {
      const cardExists = col.cards.find((c) => c.key === issueKey);
      if (cardExists) {
        movedCard = { ...cardExists, status: newStatus };
      }
      return { ...col, cards: col.cards.filter((c) => c.key !== issueKey) };
    });

    if (movedCard) {
      // 2. Insert card into the new status column
      const finalCols = columnsWithoutCard.map((col) =>
        col.status === newStatus
          ? { ...col, cards: [movedCard, ...col.cards] }
          : col
      );

      setColumns(finalCols);
      
      if (selectedIssue && selectedIssue.key === issueKey) {
        setSelectedIssue(movedCard);
      }

      if (onIssueSync) onIssueSync(movedCard, 'UPDATE');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-20 rounded-xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-sm">
            <KanbanIcon size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Kanban Dashboard</h1>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                Continuous Delivery
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">FlowBoard • Visual flow & WIP limit monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Create Issue</span>
          </button>
        </div>
      </div>

      {/* Board Columns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start pb-6">
        {columns.map((col) => {
          const isOver = dragOverCol === col.id;
          const columnCardCount = col.cards.length; // Calculated dynamically

          return (
            <div
              key={col.id}
              onDragOver={(e) => handleDragOver(e, col.id)}
              onDragLeave={() => handleDragLeave(col.id)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-xl p-3.5 flex flex-col gap-3 min-h-[560px] border transition-all ${
                isOver
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500 shadow-md'
                  : 'bg-gray-100/90 border-gray-200'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-black text-gray-800 tracking-wider uppercase">
                  {col.title}
                </span>
                <span className="bg-gray-200 text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {columnCardCount}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1">
                {col.cards.map((card) => (
                  <div
                    key={card.key}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card)}
                    onClick={() => setSelectedIssue(card)}
                    className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm space-y-2.5 cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <GripVertical size={12} className="text-gray-300 group-hover:text-gray-500" />
                        <span className="font-mono text-xs font-bold text-blue-700">
                          {card.key}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          card.priority === 'Highest' || card.priority === 'High'
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {card.priority}
                      </span>
                    </div>

                    <h3 className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">
                      {card.title}
                    </h3>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
                      <span className="font-mono font-bold text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                        {card.points || 0} pts
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {card.issueType || 'Task'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Empty State / Dropzone UI */}
                {columnCardCount === 0 && (
                  <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs text-gray-400 bg-white/50">
                    Drop cards here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateIssueModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateIssue}
      />

      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onUpdateStatus={handleStatusChange}
        />
      )}
    </div>
  );
};

export default KanbanBoard;