const fs = require('fs');
const {
    filterByQuery,
    findById,
    createNewNote,
    validateNote,
} = require('../lib/notes.js');
const { notes } = require('../db/db.json');

jest.mock('fs');

test('creates a note object', () => {
    const note = createNewNote(
        { title: "Test", id: "jhgdja3ng2"},
        notes
    );
    expect(note.title).toBe("Test");
    expect(note.id).toBe("jhgdja3ng2")
});

test('filters by query', () => {
    const startingNotes = [
        {
            id: '3',
            title: 'Test',
            text: 'Test note'
        },
        {
            id: '4',
            title: 'Test Again',
            test: 'Bartok fuss'
        },
    ];

    const updatedNotes = filterByQuery({ text: 'Test note' }, startingNotes);

    expect(updatedNotes.length).toEqual(1);
});

test('finds by id', () => {
    const startingNotes = [
        {
            id: '3',
            title: 'Test',
            text: 'Test note'
        },
        {
            id: '4',
            title: 'Test Again',
            test: 'Bartok fuss'
        },
    ];

    const result = findById('3', startingNotes);

    expect(result.title).toBe('Test');
});

test('validates notes', () => {
    const note = {
            id: '3',
            title: 'Test',
            text: 'Test note'
    };

    const invalidNote = {
        id: '3',
        title: 'Test'
    };

    const result = validateNote(note);
    const result2 = validateNote(invalidNote);

    expect(result).toBe(true);
    expect(result2).toBe(false);
});